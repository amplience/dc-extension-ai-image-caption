import type { Meta, StoryObj } from "@storybook/react";
import CaptionExtension from "./CaptionExtension";
import { useState } from "react";
import { ContentFieldExtensionContext } from "./WithFieldExtension";
import { Box, Button } from "@mui/material";

const Wrapper = ({
  organizationId,
  initialValue,
  schema,
  params,
  formValue,
}) => {
  const [value, setValue] = useState(initialValue || undefined);
  const [imageField, setImageField] = useState(undefined);

  const handlePopulateImage = () => {
    setImageField({
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: "338b8186-fa51-4427-8f43-edcc83b4763c",
      name: "image1",
      endpoint: "ampliencelabs",
      defaultHost: "cdn.media.amplience.net",
    });
  };

  const handlePopulateImage2 = () => {
    setImageField({
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: "338b8186-fa51-4427-8f43-edcc83b4763c",
      name: "image2",
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
            request: async (request, { vars }) => {
              await new Promise((resolve) =>
                setTimeout(
                  resolve,
                  vars.imageUrl.indexOf("image1") !== -1 ? 10000 : 1000
                )
              );
              return {
                data: {
                  node: {
                    generateCaptionForImage: {
                      caption: vars.imageUrl,
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
            async getPath() {
              return "/image/seo/alt";
            },
          },
          form: {},
          formValue: formValue || {
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
          <Button onClick={handlePopulateImage2}>Populate Image Field 2</Button>
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

export const WithRelativePointer: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "3/img",
      },
    },
    organizationId: "org12345",
    initialValue: "saved value",
    formValue: {
      img: {
        _meta: {
          schema:
            "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
        },
        id: "338b8186-fa51-4427-8f43-edcc83b4763c",
        name: "image1",
        endpoint: "ampliencelabs",
        defaultHost: "cdn.media.amplience.net",
      },
      seo: {
        image: {
          alt: "caption",
        },
      },
    },
  },
};

export const WithNestedRelativePointer: Story = {
  args: {
    schema: {
      title: "Caption",
      description: "Alt text",
    },
    params: {
      installation: {
        image: "2/src",
      },
    },
    organizationId: "org12345",
    initialValue: "saved value",
    formValue: {
      image: {
        src: {
          _meta: {
            schema:
              "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
          },
          id: "338b8186-fa51-4427-8f43-edcc83b4763c",
          name: "image1",
          endpoint: "ampliencelabs",
          defaultHost: "cdn.media.amplience.net",
        },
        seo: {
          alt: "caption",
        },
      },
    },
  },
};
