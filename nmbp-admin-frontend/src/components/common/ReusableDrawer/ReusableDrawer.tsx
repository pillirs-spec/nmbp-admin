import React from "react";
import { Drawer, Modal } from "@mantine/core";
import { ReusableDrawerProps } from "./ReusableDrawerTypes";

const ReusableDrawer: React.FC<ReusableDrawerProps> = ({
  opened,
  onClose,
  title,
  children,
  closeButtonProps,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={title}
      closeButtonProps={closeButtonProps}
    >
      {children}
    </Modal>
  );
};

export default ReusableDrawer;
