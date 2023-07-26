import type { Meta, StoryObj } from "@storybook/react";
import StringField from "./StringField";
import { useState } from "react";

const Wrapper = (args) => {
  const [value, setValue] = useState("");
  return (
    <StringField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const meta: Meta<typeof StringField> = {
  component: StringField,
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export default meta;
type Story = StoryObj<typeof StringField>;

export const Primary: Story = {
  args: {
    schema: {},
  },
};

export const Title: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
    },
  },
};

export const Description: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
    },
  },
};

export const MaxLength: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      maxLength: 10,
    },
  },
};

export const MinLength: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      minLength: 10,
    },
  },
};

export const Pattern: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      pattern: "[0-9]+",
    },
  },
};

export const ReadOnly: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      minLength: 10,
    },
    readOnly: true,
  },
};

export const Loading: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      minLength: 10,
    },
    loading: true,
  },
};
