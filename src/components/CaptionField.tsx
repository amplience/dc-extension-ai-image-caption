import React from "react";
import { Box, IconButton, InputAdornment } from "@mui/material";

import AssistantIcon from "@mui/icons-material/Assistant";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SparkleIcon from "./SparkleIcon";

import StringField, { StringFieldProps } from "./StringField";

export type CaptionFieldProps = StringFieldProps & {
  captioningVisible?: boolean;
  captioningDisabled?: boolean;
  onCaption?: () => void;
  onCancelCaption?: () => void;
};

function CaptionField(props: CaptionFieldProps) {
  const {
    loading,
    onCaption,
    onCancelCaption,
    captioningVisible = true,
    captioningDisabled,
    readOnly,
    ...other
  } = props;

  return (
    <StringField
      {...other}
      readOnly={readOnly}
      style={{ width: "100%" }}
      loading={loading}
      InputProps={{
        endAdornment: captioningVisible ? (
          <InputAdornment position="end" style={{ marginRight: 10 }}>
            {loading ? (
              <IconButton
                aria-label="cancel"
                edge="end"
                onClick={onCancelCaption}
              >
                <CancelOutlinedIcon fontSize="medium" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="generate caption"
                edge="end"
                color="primary"
                onClick={onCaption}
                disabled={captioningDisabled || readOnly}
              >
                <SparkleIcon />
              </IconButton>
            )}
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}

export default CaptionField;
