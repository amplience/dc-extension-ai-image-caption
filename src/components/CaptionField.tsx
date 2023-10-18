import React from "react";

import StringField, { StringFieldProps } from "./StringField";

export type CaptionFieldProps = StringFieldProps & {
  captioningDisabled?: boolean;
  onCaption?: (generationSource: "auto" | "manual") => void;
  onCancelCaption?: () => void;
};

function CaptionField(props: CaptionFieldProps) {
  const {
    loading,
    onCaption,
    onCancelCaption,
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
    />
  );
}

export default CaptionField;
