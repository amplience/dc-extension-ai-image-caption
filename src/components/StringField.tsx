import React from "react";
import {
  LinearProgress,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";

export type StringFieldProps = TextFieldProps & {
  schema?: any;
  value: string;
  readOnly?: boolean;
  loading?: boolean;
  captionError?: { message: String; stack: String };
};

function StringField(props: StringFieldProps) {
  const {
    schema = {},
    value,
    readOnly,
    loading = false,
    captionError,
    ...fieldProps
  } = props;
  const label = schema?.title || "";
  const description = schema?.description || "";

  const maxLength = schema?.maxLength;
  const minLength = schema?.minLength;
  const pattern =
    typeof schema?.pattern === "string"
      ? new RegExp(schema?.pattern)
      : undefined;

  const isAboveMaxLength =
    value && maxLength ? value.length > maxLength : false;
  const isBelowMinLength =
    value && minLength ? value.length < minLength : false;
  const isNotMatchingPattern = value && pattern ? !pattern.test(value) : false;

  let message: string = description;
  let invalid: boolean =
    isAboveMaxLength || isBelowMinLength || isNotMatchingPattern;

  const errorMessages = {
    invalidOrg: "Invalid organization",
    permissionError: "Missing read permission",
    invalidUrl: "Invalid image URL",
    invalidHostName: "Invalid image hostname",
    internalServerError:
      "An error occurred processing your request, please try again",
    quotaExceeded: "Exceeded allocated quota",
  };

  let captionErrorMsg = undefined;

  if (captionError) {
    if (captionError?.message.includes("Invalid organization")) {
      captionErrorMsg = errorMessages.invalidOrg;
    } else if (captionError?.message.includes("Missing permission")) {
      captionErrorMsg = errorMessages.permissionError;
    } else if (captionError?.message.includes("Invalid image URL")) {
      captionErrorMsg = errorMessages.invalidUrl;
    } else if (captionError?.message.includes("Invalid image hostname")) {
      captionErrorMsg = errorMessages.invalidHostName;
    } else if (captionError?.message.includes("Exceeded allocated quota")) {
      captionErrorMsg = errorMessages.quotaExceeded;
    } else {
      captionErrorMsg = errorMessages.internalServerError;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
      <TextField
        variant="standard"
        label={label}
        disabled={loading || readOnly || props.disabled}
        aria-label={description || label}
        value={value}
        error={captionError ? true : false}
        helperText={captionErrorMsg}
        {...fieldProps}
      />

      <LinearProgress
        variant="indeterminate"
        style={{ opacity: loading ? 1 : 0, marginTop: -2 }}
      />

      {!invalid && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="caption">{message}</Typography>

          <div style={{ flexGrow: 1 }} />

          {maxLength && (
            <Typography variant="caption" style={{ fontSize: 12 }}>
              {value?.length || 0} / {maxLength}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default StringField;
