import React, { useEffect, useReducer, useState } from "react";
import { useContentFieldExtension } from "./WithFieldExtension";
import CaptionField from "./CaptionField";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";
import { track } from "../gainsight";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { SparklesIcon } from "./SparklesIcon";

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

let captionError = undefined;

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

    if (newValue.match(/[\n\t\r]+|\s{2,}/g)) {
      return;
    }

    sdk.field.setValue(newValue).catch(() => {});
    dispatch({ type: "SET_INPUT_VALUE", inputValue: newValue });
  };

  const handleCaption = async (generationSource: "auto" | "manual") => {
    try {
      const currentImageUrl = imageUrl;
      if (!imageUrl) {
        return;
      }

      dispatch({ type: "START_CAPTION", imageUrl: currentImageUrl });
      track(window, "AI Alt Text Generator", { generationSource });

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
      captionError = err;
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
      handleCaption("auto");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  useEffect(() => {
    const getThumbUrl = async (id) => {
      const asset = await sdk.assets.getById(id);
      return `${asset.thumbURL}?w=512&h=512&upscale=false&sm=clamp`;
    };
    try {
      sdk.field.getPath().then((path) => {
        const imageValue = RelativeJSONPointer.evaluate(
          imagePointer,
          sdk.formValue,
          path
        );
        const isImage =
          imageValue?._meta?.schema ===
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";
        const imageChanged = imageId !== imageValue?.id;

        if (isImage && imageChanged) {
          setImageId(imageValue.id);
          getThumbUrl(imageValue.id).then(setImageUrl);
        }
      });
    } catch (e) {
      setImageUrl(undefined);
      captionError = e;
    }
  }, [sdk.formValue, imagePointer, sdk.assets, imageId, sdk.field]);

  return (
    <div>
      <Grid container spacing={1} width="100%">
        <Grid item xs="auto">
          <SparklesIcon />
        </Grid>
        <Grid container item spacing={1} xs>
          <Grid item xs>
            <Typography sx={{ fontSize: "13px", color: "#333" }}>
              AI Alt Text Generator
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: "#666",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              Add an image and generate an alt text.&nbsp;
              <Link
                href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
                color="#039BE5"
                underline="none"
                sx={{ fontSize: "11px" }}
              >
                Amplience Labs Preview
              </Link>
            </Typography>

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
              captionError={captionError}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CaptionExtension;
