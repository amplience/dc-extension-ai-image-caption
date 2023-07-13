import type { Meta, StoryObj } from "@storybook/react";
import CaptionExtension from "./CaptionExtension";
import { useState } from "react";
import { ContentFieldExtensionContext } from "./WithFieldExtension";
import { Box, Button } from "@mui/material";

const Wrapper = ({ organizationId, initialValue, schema, params }) => {
  const [value, setValue] = useState(initialValue || undefined);
  const [imageField, setImageField] = useState(undefined);

  const handlePopulateImage = () => {
    setImageField({
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: "338b8186-fa51-4427-8f43-edcc83b4763c",
      name: "Sandicliffe-May-Bank-Holiday-Blog-Banner",
      endpoint: "ampliencelabs",
      defaultHost: "cdn.media.amplience.net",
    });
  };

  const handlePopulateNonImage = () => {
    setImageField("hello world");
  };

  const handleClearImage = () => {
    setImageField(undefined);
  };

  return (
    <ContentFieldExtensionContext.Provider
      value={
        {
          connection: {
            request: async () => {
              await new Promise((resolve) => setTimeout(resolve, 3000));
              return {
                data: {
                  node: {
                    generateCaptionForImage: {
                      caption: "generated caption",
                    },
                  },
                },
              };
            },
          },
          field: {
            schema,
            getValue: async () => {
              return value;
            },
            setValue: async (value: string) => {
              setValue(value);
            },
          },
          form: {},
          formValue: {
            img: imageField,
            caption: value,
          },
          params: {
            ...params,
          },
          hub: { organizationId },
          initialValue,
        } as any
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CaptionExtension />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={handlePopulateImage}>Populate Image Field</Button>
          <Button onClick={handlePopulateNonImage}>
            Populate Image Field with non-image
          </Button>
          <Button onClick={handleClearImage}>Clear Image Field</Button>
        </Box>
      </Box>
    </ContentFieldExtensionContext.Provider>
  );
};

const meta: Meta<typeof CaptionExtension> = {
  component: CaptionExtension,
  render: (args: any) => {
    return <Wrapper {...args} />;
  },
};

export default meta;
type Story = StoryObj<typeof CaptionExtension>;

export const Primary: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "/img",
      },
    },
    organizationId: "org12345",
  },
};

export const WithoutOrgId: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "/img",
      },
    },
  },
};

export const WithoutImageParam: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    organizationId: "org12345",
    params: {},
  },
};

export const WithInstanceImageField: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    organizationId: "org12345",
    params: {
      instance: {
        image: "/img",
      },
    },
  },
};

export const WithInstallationImageField: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    organizationId: "org12345",
    params: {
      installation: {
        image: "/img",
      },
    },
  },
};

export const WithInitialValue: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "/img",
      },
    },
    organizationId: "org12345",
    initialValue: "saved value",
  },
};

export const WithNonStringInitialValue: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "/img",
      },
    },
    organizationId: "org12345",
    initialValue: {},
  },
};

export const AutoCaption: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "/img",
        autoCaption: true,
      },
    },
    organizationId: "org12345",
    initialValue: {},
  },
};
