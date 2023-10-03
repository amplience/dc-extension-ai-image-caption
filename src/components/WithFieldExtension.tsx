import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { createContext, useContext, useEffect, useState } from "react";

export type ContentFieldExtensionContextState = ContentFieldExtension & {
  initialValue: any;
  formValue: any;
  readOnly: boolean;
  fieldPointer: string | undefined;
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
  const [fieldPointer, setFieldPointer] = useState(undefined);

  const detectFieldPointer = async (sdk: ContentFieldExtension) => {
    for (let potentialInvalidValue of [1, "", true, {}, []]) {
      try {
        const validationResult = await sdk.field.validate(
          potentialInvalidValue
        );
        if (validationResult?.[0]?.pointer) {
          return validationResult?.[0]?.pointer;
        }
      } catch (err: any) {}
    }
  };

  useEffect(() => {
    init().then((sdk: ContentFieldExtension) => {
      setReadOnly(sdk.form.readOnly);
      sdk.field.getValue().then((value) => {
        setInitialValue(value);
        setSDK(sdk);
        detectFieldPointer(sdk)
          .then(setFieldPointer)
          .catch(() => {});
      });
      sdk.frame.startAutoResizer();
      sdk.form.onReadOnlyChange(setReadOnly);
      sdk.form.onFormValueChange(setFormValue);
    });
  }, []);

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{ ...sdk, initialValue, readOnly, formValue, fieldPointer }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
}

export default WithContentFieldExtension;
