import React, { useEffect, useMemo, useReducer } from "react";
import { useContentFieldExtension } from "./WithFieldExtension";
import CaptionField from "./CaptionField";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";

type SetInputValueReducerAction = {
  type: "SET_INPUT_VALUE";
  inputValue: string;
};

type StartCaptionReducerAction = {
  type: "START_CAPTION";
  imageUrl: string;
};

type CompleteCaptionReducerAction = {
  type: "COMPLETE_CAPTION";
  imageUrl: string;
  caption: string;
};

type CancelCaptionReducerAction = {
  type: "CANCEL_CAPTION";
};

type FailedCaptionReducerAction = {
  type: "FAILED_CAPTION";
};

type ReducerAction =
  | SetInputValueReducerAction
  | StartCaptionReducerAction
  | CompleteCaptionReducerAction
  | CancelCaptionReducerAction
  | FailedCaptionReducerAction;

type ReducerState = {
  status: "idle" | "captioning";
  captioningImageUrl?: string;
  inputValue: string;
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.inputValue };
    case "START_CAPTION":
      return {
        ...state,
        status: "captioning",
        captioningImageUrl: action.imageUrl,
      };
    case "COMPLETE_CAPTION":
      if (
        state.status === "captioning" &&
        state.captioningImageUrl === action.imageUrl
      ) {
        return { ...state, status: "idle", inputValue: action.caption };
      } else {
        return state;
      }
    case "CANCEL_CAPTION":
    case "FAILED_CAPTION":
      return { ...state, status: "idle", captioningImageUrl: undefined };
    default:
      return state;
  }
};

const query = `
  query generateCaptionForImage($orgId: ID!, $imageUrl: String!) {
    node(id: $orgId) {
      id
      ... on Organization {
        id
        generateCaptionForImage(imageUrl: $imageUrl) {
          caption
        }
      }
    }
  }`;

function CaptionExtension() {
  const sdk = useContentFieldExtension();

  const [{ inputValue, status }, dispatch] = useReducer(reducer, {
    inputValue:
      sdk.initialValue && typeof sdk.initialValue === "string"
        ? sdk.initialValue
        : "",
    status: "idle",
  });

  const imagePointer =
    sdk.params.installation?.["image"] || sdk.params.instance?.["image"];

  const autoCaption =
    sdk.params.installation?.["autoCaption"] === true ||
    sdk.params.instance?.["autoCaption"] === true;

  const canCaption =
    imagePointer !== undefined && sdk.hub.organizationId !== undefined;

  const defaultHost =
    sdk.params.installation?.["imageHost"] ||
    sdk.params.instance?.["imageHost"] ||
    sdk.visualisation ||
    process.env.REACT_APP_IMAGE_HOST;

  const imageUrl = useMemo(() => {
    try {
      const imageValue = RelativeJSONPointer.evaluate(
        imagePointer,
        sdk.formValue,
        sdk.fieldPointer
      );
      if (
        !imageValue ||
        imageValue?._meta?.schema !==
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      ) {
        return undefined;
      } else {
        return `https://${
          defaultHost || imageValue.defaultHost
        }/i/${encodeURIComponent(imageValue?.endpoint)}/${encodeURIComponent(
          imageValue?.name
        )}.png?w=512&h=512&upscale=false&sm=clamp`;
      }
    } catch (err) {
      return undefined;
    }
  }, [imagePointer, sdk.formValue, sdk.fieldPointer, defaultHost]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    sdk.field.setValue(newValue);
    dispatch({ type: "SET_INPUT_VALUE", inputValue: newValue });
  };

  const handleCaption = async () => {
    try {
      const currentImageUrl = imageUrl;
      if (!imageUrl) {
        return;
      }

      dispatch({ type: "START_CAPTION", imageUrl: currentImageUrl });

      const { data } = await sdk.connection.request(
        "dc-management-sdk-js:graphQL",
        {
          query,
          vars: {
            orgId: btoa(`Organization:${sdk.hub.organizationId}`),
            imageUrl: imageUrl,
          },
        }
      );

      if (data?.node?.generateCaptionForImage?.caption) {
        const caption = data.node.generateCaptionForImage?.caption;
        dispatch({
          type: "COMPLETE_CAPTION",
          caption,
          imageUrl: currentImageUrl,
        });
      } else {
        dispatch({
          type: "FAILED_CAPTION",
        });
      }
    } catch (err) {
      dispatch({
        type: "FAILED_CAPTION",
      });
    }
  };

  const handleCancelCaption = () => {
    dispatch({ type: "CANCEL_CAPTION" });
  };

  useEffect(() => {
    if (canCaption && autoCaption && (inputValue === "" || !inputValue)) {
      handleCaption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return (
    <div>
      <CaptionField
        value={inputValue}
        onChange={handleChange}
        onCaption={handleCaption}
        onCancelCaption={handleCancelCaption}
        captioningVisible={canCaption}
        captioningDisabled={imageUrl === undefined}
        schema={sdk.field.schema}
        readOnly={sdk.readOnly}
        loading={status === "captioning"}
      />
    </div>
  );
}

export default CaptionExtension;
