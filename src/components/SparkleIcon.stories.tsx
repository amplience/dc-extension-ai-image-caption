import type { Meta, StoryObj } from "@storybook/react";
import SparkleIcon from "./SparkleIcon";

const meta: Meta<typeof SparkleIcon> = {
  component: SparkleIcon,
};

export default meta;
type Story = StoryObj<typeof SparkleIcon>;

export const Primary: Story = {
  args: {},
};
