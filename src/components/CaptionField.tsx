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
  onCaption?: (generationSource: "auto" | "manual") => void;
  onCancelCaption?: () => void;
  captionError?: { message: String; stack: String };
};

function CaptionField(props: CaptionFieldProps) {
  const {
    loading,
    onCaption,
    onCancelCaption,
    captioningVisible = true,
    captioningDisabled,
    readOnly,
    captionError,
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

  const handleClick = () => {
    onCaption("manual");
  };

  return (
    <StringField
      {...other}
      readOnly={readOnly}
      style={{ width: "100%" }}
      loading={loading}
      captionError={captionError}
      InputProps={{
        endAdornment: captioningVisible ? (
          <InputAdornment
            position="end"
            style={{ marginRight: 10, marginTop: 9, alignSelf: "flex-start" }}
          >
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
                <span>
                  <IconButton
                    aria-label="generate caption"
                    edge="end"
                    color="primary"
                    onClick={handleClick}
                    disabled={captioningDisabled || readOnly}
                  >
                    <SparkleIcon />
                  </IconButton>
                </span>
              </ButtonTooltip>
            )}
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}

export default CaptionField;
