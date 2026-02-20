import React from "react";
import { notifications } from "@mantine/notifications";
import { ToastContext } from "./ToastContext";
import { ToastType } from "../enums";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const showToast = (
    message: string,
    title?: string,
    type: ToastType = ToastType.INFO,
    autoClose = 3000,
  ) => {
    notifications.show({
      id: crypto.randomUUID(),
      withCloseButton: true,
      autoClose,
      title,
      message,
      color:
        type === ToastType.ERROR
          ? "red"
          : type === ToastType.SUCCESS
            ? "green"
            : type === ToastType.WARNING
              ? "yellow"
              : "blue",
      withBorder: true,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};
