import React from "react";
import { Drawer } from "@mantine/core";
import { CommonDrawerProps } from "./commonDrawerTypes";
import "./CommonDrawer.scss";

const CommonDrawer: React.FC<CommonDrawerProps> = ({
  opened,
  onClose,
  title,
  children,
  position = "right",
  closeButtonProps,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={position}
      title={title}
      closeButtonProps={closeButtonProps}
      size="xl"
      padding="md"
      withCloseButton={true}
    >
      {children}
    </Drawer>
  );
};

export default CommonDrawer;
