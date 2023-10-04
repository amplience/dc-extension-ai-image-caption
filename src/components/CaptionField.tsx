import React from "react";
import {
  IconButton,
  InputAdornment,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";

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

  const ButtonTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#1a222d",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "14px",
      padding: "5px 9px",
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#1a222d",
    },
  }));

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
              <ButtonTooltip
                title="Generate Alt Text"
                placement="left"
                disableInteractive
                className="buttonTooltip"
                arrow
              >
                <IconButton
                  aria-label="generate caption"
                  edge="end"
                  color="primary"
                  onClick={onCaption}
                  disabled={captioningDisabled || readOnly}
                >
                  <SparkleIcon />
                </IconButton>
              </ButtonTooltip>
            )}
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}

export default CaptionField;
