import { SvgIcon } from "@mui/material";

export const SparklesIcon = (props: { readOnly?: boolean }) => {
  return (
    <SvgIcon
      sx={{ fontSize: "32px", color: props.readOnly ? "#D9D9D9" : "#F88B8B" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-sparkles"
        width="32"
        height="32"
        // viewBox="0 0 32 32"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
      </svg>
    </SvgIcon>
  );
};
