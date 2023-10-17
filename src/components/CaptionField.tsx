import React from "react";

import StringField, { StringFieldProps } from "./StringField";

export type CaptionFieldProps = StringFieldProps & {
  captioningDisabled?: boolean;
  onCaption?: (generationSource: "auto" | "manual") => void;
  onCancelCaption?: () => void;
  captionError?: { message: String; stack: String };
};

function CaptionField(props: CaptionFieldProps) {
  const {
    loading,
    onCaption,
    onCancelCaption,
    captioningDisabled,
    readOnly,
    captionError,
    ...other
  } = props;

  return (
    <StringField
      {...other}
      readOnly={readOnly}
      style={{ width: "100%" }}
      loading={loading}
      captionError={captionError}
    />
  );
}

export default CaptionField;
