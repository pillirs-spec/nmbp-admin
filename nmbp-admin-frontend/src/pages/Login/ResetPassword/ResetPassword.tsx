import React from "react";
import HeaderLogo from "../../../assets/logo.png";
import { Button, PasswordInput, Stack, Title } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import resetPasswordValidation from "./resetPasswordValidation";
import resetPasswordService from "./resetPasswordService";
import { useLogger, useToast } from "../../../hooks";
import { LogLevel, ToastType } from "../../../enums";
import { encDec } from "../../../utils";

const ResetPassword: React.FC = () => {
  const [visible, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { log } = useLogger();
  const { showToast } = useToast();
  const txnId = location.state?.txnId;

  const validationSchema = resetPasswordValidation.validateResetPassword();
  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: yupResolver(validationSchema),
  });

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (!txnId) {
        showToast("Invalid reset password request. Please try again.", "Error", ToastType.ERROR);
        navigate("/forget-password");
        return;
      }
      const encryptedNewPassword = encDec.encrypt(values.newPassword);
      const encryptedConfirmPassword = encDec.encrypt(values.confirmPassword);
      const response = await resetPasswordService.resetPassword(
        txnId,
        encryptedNewPassword,
        encryptedConfirmPassword
      );
      if (response.status === 200) {
        showToast("Password reset successfully!", "Success", ToastType.SUCCESS);
        navigate("/login");
      }
    } catch (error: any) {
      log(LogLevel.ERROR, "ResetPassword :: handleResetPassword", error);
      const errorMessage = error?.response?.data?.errorMessage || "Password reset failed. Please try again.";
      showToast(errorMessage, "Error", ToastType.ERROR);
    }
  };

  return (
    <div className="w-full min-h-screen pt-20 bg-[#FFF2E9] flex flex-col items-center justify-center px-5 md:px-0">
      <img src={HeaderLogo} alt="Temple Logo" className="h-20 w-20 mb-4" />
      <div className="w-[400px] lg:w-[450px] bg-white rounded-[32px] px-5 py-4 flex flex-col items-center">
        <div className="mb-8">
          <Title order={2}>Reset Password</Title>
        </div>

        <form className="w-full" onSubmit={form.onSubmit(handleResetPassword)}>
          <div className="space-y-4 w-full">
            <div className="mb-4 text-start relative">
              <Stack>
                <PasswordInput
                  label="New Password"
                  placeholder="Enter your new password"
                  size="md"
                  radius="md"
                  value={form.values.newPassword}
                  {...form.getInputProps("newPassword")}
                  error={form.errors.newPassword}
                  classNames={{
                    input:
                      "!w-full border bg-[#F0F0F0] pl-3 mt-2 h-10 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 rounded-lg",
                    label: "mb-1 ml-3 mt-2 text-gray-500 text-start",
                  }}
                />
              </Stack>
            </div>

            <div className="mb-4 text-start relative">
              <Stack>
                <PasswordInput
                  label="Confirm Password"
                  visible={visible}
                  onVisibilityChange={toggle}
                  placeholder="Confirm your new password"
                  size="md"
                  radius="md"
                  {...form.getInputProps("confirmPassword")}
                  error={form.errors.confirmPassword}
                  classNames={{
                    input:
                      "!w-full border bg-[#F0F0F0] pl-3 mt-2 h-10 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 rounded-lg",
                    label: "mb-1 ml-3 mt-2 text-gray-500 text-start",
                  }}
                />
              </Stack>
            </div>
          </div>

          <div className="w-full">
            <Button
              fullWidth
              size="md"
              radius="xl"
              color="red"
              className="bg-[#990007] font-[500] text-white rounded-lg py-2 mt-7"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
