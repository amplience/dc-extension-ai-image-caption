import React, { useEffect, useReducer, useState } from "react";
import { useContentFieldExtension } from "./WithFieldExtension";
import CaptionField from "./CaptionField";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";
import { track } from "../gainsight";
import { Button, Grid, Link, Stack, Tooltip, Typography } from "@mui/material";
import { SparklesIcon } from "./SparklesIcon";
import { LoadingIcon } from "./LoadingIcon";

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

function LabsPreviewLink() {
  return (
    <Link
      href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
      target="_blank"
      underline="none"
      variant="link"
    >
      Amplience Labs Preview
    </Link>
  );
}

const isInsufficientCreditsError = (error: any) =>
  error?.data?.errors?.[0]?.extensions?.code === "INSUFFICIENT_CREDITS";

function CaptionError({
  error,
  trackingParams,
}: {
  error: any;
  trackingParams: any;
}) {
  if (isInsufficientCreditsError(error)) {
    track(window, "AI Credits Limit reached", trackingParams);
    return (
      <>
        You're out of Amplience credits. You can still enter alt text yourself.{" "}
        <Link
          href="https://amplience.com/developers/docs/ai-services/credits"
          target="_blank"
          underline="none"
          variant="link"
        >
          Top up your credits
        </Link>
      </>
    );
  }

  return (
    <>
      An error occurred while processing your request. You can still enter alt
      text yourself. <LabsPreviewLink></LabsPreviewLink>
    </>
  );
}

let captionError;

function CaptionExtension() {
  const sdk = useContentFieldExtension();

  const [{ inputValue, status }, dispatch] = useReducer(reducer, {
    inputValue: sdk?.initialValue || "",
    status: "idle",
  });
  const trackingParams = {
    name: "dc-extension-ai-image-caption",
    category: "Extension",
  };

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
      track(window, "AI Alt Text Generator", {
        ...trackingParams,
        generationSource,
      });

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
        track(window, "AI Credits used", trackingParams);

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

  const handleClick = () => {
    handleCaption("manual");
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
      sdk.field.getValue().then((val: string) => {
        if (val !== inputValue) {
          dispatch({ type: "SET_INPUT_VALUE", inputValue: val });
        }
      });
    } catch (e) {
      setImageUrl(undefined);
      captionError = e;
    }
  }, [sdk.formValue, imagePointer, sdk.assets, imageId, sdk.field, inputValue]);

  const isInactive =
    sdk.readOnly || !imageUrl || isInsufficientCreditsError(captionError);

  return (
    <div>
      <Grid container spacing={1} width="100%">
        <Grid item xs="auto">
          <SparklesIcon inactive={isInactive} />
        </Grid>
        <Grid container item spacing={1} xs direction="column">
          <Grid container item xs justifyContent="flex-end">
            <Grid item xs>
              <Stack direction="column">
                <Typography variant="title" color={isInactive ? "#BFBFBF" : ""}>
                  Image Alt Text Generator
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Typography variant={captionError ? "error" : "subtitle"}>
                    {captionError ? (
                      <CaptionError
                        error={captionError}
                        trackingParams={trackingParams}
                      ></CaptionError>
                    ) : (
                      "Add an image and generate an alt text."
                    )}
                  </Typography>
                  {!captionError ? <LabsPreviewLink></LabsPreviewLink> : ""}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs="auto">
              {status === "captioning" ? (
                <LoadingIcon />
              ) : (
                <Tooltip
                  title="Add an image"
                  arrow
                  placement="left"
                  disableInteractive
                  disableFocusListener={!isInactive}
                  disableHoverListener={!isInactive}
                  disableTouchListener={!isInactive}
                >
                  <span>
                    <Button
                      variant="outlined"
                      disabled={isInactive}
                      onClick={handleClick}
                    >
                      Generate
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          <Grid item xs>
            <CaptionField
              value={inputValue}
              onChange={handleChange}
              onCaption={handleCaption}
              onCancelCaption={handleCancelCaption}
              schema={sdk.field.schema}
              inactive={isInactive}
              loading={status === "captioning"}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CaptionExtension;
