import React, { useEffect, useReducer, useState } from "react";
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

const mutation = `
  mutation generateCaptionForImage($orgId: ID!, $imageUrl: String!) {
    generateCaptionForImage(
      input: {
        organizationId: $orgId
        imageUrl: $imageUrl
      }
    ) {
      caption
    }
  }
`;

function CaptionExtension() {
  const sdk = useContentFieldExtension();

  const [{ inputValue, status }, dispatch] = useReducer(reducer, {
    inputValue: sdk?.initialValue || "",
    status: "idle",
  });

  const [imageUrl, setImageUrl] = useState<string>();
  const [imageId, setImageId] = useState<string>();

  const imagePointer =
    sdk.params.installation?.["image"] || sdk.params.instance?.["image"];

  const autoCaption =
    sdk.params.installation?.["autoCaption"] === true ||
    sdk.params.instance?.["autoCaption"] === true;

  const canCaption =
    imagePointer !== undefined && sdk.hub.organizationId !== undefined;

  const handleChange = (event) => {
    const newValue = event.target.value;

    sdk.field.setValue(newValue).catch(() => {});
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
        "dc-management-sdk-js:graphql-mutation",
        {
          mutation,
          vars: {
            orgId: btoa(`Organization:${sdk.hub.organizationId}`),
            imageUrl: imageUrl,
          },
        }
      );

      if (data?.generateCaptionForImage?.caption) {
        const caption = data.generateCaptionForImage.caption;
        sdk.field.setValue(caption).catch(() => {});
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

  useEffect(() => {
    const getThumbUrl = async (id) => {
      const asset = await sdk.assets.getById(id);
      return `${asset.thumbURL}?w=512&h=512&upscale=false&sm=clamp`;
    };
    try {
      const imageValue = RelativeJSONPointer.evaluate(
        imagePointer,
        sdk.formValue,
        sdk.fieldPointer
      );
      const isImage =
        imageValue?._meta?.schema ===
        "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";
      const imageChanged = imageId !== imageValue.id;

      if (isImage && imageChanged) {
        setImageId(imageValue.id);
        getThumbUrl(imageValue.id).then(setImageUrl);
      }
    } catch (e) {
      setImageUrl(undefined);
    }
  }, [sdk.formValue, sdk.fieldPointer, imagePointer, sdk.assets]);

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
