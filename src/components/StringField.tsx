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
};

function StringField(props: StringFieldProps) {
  const { schema = {}, value, readOnly, loading = false } = props;
  const label = schema?.title || "";
  const description = schema?.description || "";

  const maxLength =
    schema?.maxLength && typeof schema?.maxLength === "number"
      ? schema?.maxLength
      : undefined;

  const minLength =
    schema?.minLength && typeof schema?.minLength === "number"
      ? schema?.minLength
      : undefined;

  const pattern =
    schema?.pattern && typeof schema?.pattern === "string"
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

  return (
    <div style={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
      <TextField
        variant="standard"
        label={label}
        disabled={loading || readOnly || props.disabled}
        aria-label={description || label}
        {...props}
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
