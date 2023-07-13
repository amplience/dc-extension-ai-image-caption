import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Theme from "./components/Theme";
import WithContentFieldExtension from "./components/WithFieldExtension";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WithContentFieldExtension key={"extension"}>
      <Theme>
        <App />
      </Theme>
    </WithContentFieldExtension>
  </React.StrictMode>
);
