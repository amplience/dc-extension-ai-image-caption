import type { Meta, StoryObj } from "@storybook/react";
import CaptionField from "./CaptionField";
import { useState } from "react";

const Wrapper = (args) => {
  const [value, setValue] = useState("");
  return (
    <CaptionField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const meta: Meta<typeof CaptionField> = {
  component: CaptionField,
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export default meta;
type Story = StoryObj<typeof CaptionField>;

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

export const ReadOnly: Story = {
  args: {
    value: "value",
    schema: {
      title: "My field",
      description: "description",
      minLength: 10,
    },
    inactive: true,
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

export const CaptioningDisabled: Story = {
  args: {
    inactive: true,
  },
};
