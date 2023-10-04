import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { createContext, useContext, useEffect, useState } from "react";

export type ContentFieldExtensionContextState = ContentFieldExtension & {
  initialValue: any;
  formValue: any;
  readOnly: boolean;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState>(undefined);

export function useContentFieldExtension(): ContentFieldExtensionContextState {
  return useContext(ContentFieldExtensionContext);
}

function WithContentFieldExtension({ children }) {
  const [sdk, setSDK] = useState(undefined);
  const [initialValue, setInitialValue] = useState(undefined);
  const [formValue, setFormValue] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    init().then((sdk: ContentFieldExtension) => {
      setReadOnly(sdk.form.readOnly);
      sdk.field.getValue().then((value) => {
        setInitialValue(value);
        setSDK(sdk);
      });
      sdk.frame.startAutoResizer();
      sdk.form.onReadOnlyChange(setReadOnly);
      sdk.form.onFormValueChange(setFormValue);
    });
    return () => {};
  }, []);

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{ ...sdk, initialValue, readOnly, formValue }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
}

export default WithContentFieldExtension;
