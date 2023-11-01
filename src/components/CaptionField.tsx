import React from "react";

import StringField, { StringFieldProps } from "./StringField";

export type CaptionFieldProps = StringFieldProps & {
  onCaption?: (generationSource: "auto" | "manual") => void;
  onCancelCaption?: () => void;
};

function CaptionField(props: CaptionFieldProps) {
  const { loading, onCaption, onCancelCaption, inactive, ...other } = props;

  return (
    <StringField
      {...other}
      inactive={inactive}
      style={{ width: "100%" }}
      loading={loading}
    />
  );
}

export default CaptionField;
