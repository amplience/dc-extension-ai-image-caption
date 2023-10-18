import { SvgIcon } from "@mui/material";

export const SparklesIcon = (props: { readOnly?: boolean }) => {
  return (
    <SvgIcon
      sx={{
        color: props.readOnly ? "#D9D9D9" : "#F88B8B",
        fontSize: "32px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="5.34 5.34 21.33 21.33"
      >
        <path
          fill="currentColor"
          d="M19.022 7.887a.578.578 0 0 1 1.098 0l.97 2.644c.479 1.303 1.455 2.333 2.69 2.837l2.51 1.024c.5.205.5.952 0 1.157l-2.51 1.024c-1.235.504-2.212 1.534-2.69 2.836l-.97 2.645a.578.578 0 0 1-1.098 0l-.97-2.645c-.479-1.302-1.455-2.332-2.69-2.836l-2.509-1.024c-.501-.205-.501-.952 0-1.157l2.508-1.024c1.236-.504 2.212-1.534 2.69-2.837l.971-2.644ZM11.252 18.767a.289.289 0 0 1 .549 0l.567 1.544a2.42 2.42 0 0 0 1.345 1.419l1.465.597c.25.103.25.477 0 .579l-1.465.598a2.42 2.42 0 0 0-1.345 1.418l-.567 1.545a.289.289 0 0 1-.549 0l-.567-1.545a2.42 2.42 0 0 0-1.345-1.418l-1.465-.598c-.25-.102-.25-.476 0-.579l1.465-.597a2.42 2.42 0 0 0 1.345-1.419l.567-1.544ZM8.9 5.533a.289.289 0 0 1 .548 0l.567 1.545a2.42 2.42 0 0 0 1.345 1.418l1.465.598c.251.102.251.476 0 .579l-1.464.597a2.42 2.42 0 0 0-1.346 1.419l-.567 1.544a.289.289 0 0 1-.548 0l-.567-1.544a2.42 2.42 0 0 0-1.345-1.419l-1.465-.597c-.25-.103-.25-.477 0-.579l1.465-.598a2.42 2.42 0 0 0 1.345-1.418L8.9 5.533Z"
        />
      </svg>
    </SvgIcon>
  );
};
