import React, { useState } from "react";
import HeaderLogo from "../../../assets/logo.png";
import { Button, TextInput, Title } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import forgotPasswordValidation from "./forgotPasswordValidation";
import { useLogger, useToast } from "../../../hooks";
import forgotPasswordService from "./forgotPasswordService";
import { LogLevel, ToastType } from "../../../enums";
import { encDec } from "../../../utils";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { log } = useLogger();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const validationSchema =
    forgotPasswordValidation.validateForgotPassword(isOtpSent);

  const form = useForm({
    initialValues: {
      mobileNumber: "",
      otp: "",
      txnId: "",
    },
    validate: yupResolver(validationSchema),
  });

  const handleSendOtp = async () => {
    if (form.values.mobileNumber.length !== 10) {
      showToast(
        "Please enter a valid 10-digit mobile number",
        "Error",
        ToastType.ERROR,
      );
      return;
    }
    try {
      const response = await forgotPasswordService.sendOtp(
        form.values.mobileNumber,
      );
      if (response.data) {
        setIsOtpSent(true);
        form.setFieldValue("txnId", response.data.data.txnId);
        log(LogLevel.INFO, "ForgotLoginPassword :: handleSendOtp", response);
      }
    } catch (error) {
      log(LogLevel.ERROR, "ForgotLoginPassword :: handleSendOtp", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const encryptedOtp = encDec.encrypt(form.values.otp);
      const response = await forgotPasswordService.verifyOtp(
        form.values.txnId,
        encryptedOtp,
      );
      if (response.status === 200 && response.data && response.data.data) {
        navigate("/reset-password", {
          state: { txnId: response.data.data.txnId },
        });
        log(LogLevel.INFO, "ForgotLoginPassword :: handleVerifyOtp", response);
      }
    } catch (error) {
      log(LogLevel.ERROR, "ForgotLoginPassword :: handleVerifyOtp", error);
    }
  };

  return (
    <div className="w-full min-h-screen pt-20 bg-white flex flex-col items-center justify-center px-5 md:px-0">
      <div className="w-[400px] lg:w-[450px] bg-white rounded-[32px] px-5 py-4 flex flex-col items-center shadow shadow-gray-400">
        <img src={HeaderLogo} alt="Temple Logo" className="h-20 w-20 mb-4" />
        <div className="mb-10 text-gray-600">
          <Title order={2}>Forgot Password</Title>
        </div>
        <form
          onSubmit={form.onSubmit(() => {
            isOtpSent ? handleVerifyOtp() : handleSendOtp();
          })}
          className="w-full"
        >
          <div className="mb-4 text-start">
            <TextInput
              type="text"
              label="Enter Mobile Number"
              placeholder="Enter your mobile number"
              size="md"
              radius="md"
              classNames={{
                input:
                  "!w-full border  !pl-3 !mt-2 h-10 focus:outline-none focus:border-transparent focus:ring-0 rounded-lg forget-password-input",
                label: "mb-3 text-gray-500",
              }}
              {...form.getInputProps("mobileNumber")}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  form.setFieldValue("mobileNumber", value);
                }
              }}
            />
          </div>
          {isOtpSent && (
            <div className="mb-4 text-start">
              <TextInput
                type="number"
                label="Enter OTP"
                placeholder="Enter the OTP sent to your mobile number"
                size="md"
                radius="md"
                classNames={{
                  input:
                    "!w-full border !pl-3 !mt-2 h-10 focus:outline-none focus:border-transparent focus:ring-0 rounded-lg forget-password-input",
                  label: "mb-3 text-gray-500",
                }}
                {...form.getInputProps("otp")}
              />
            </div>
          )}
          <Button
            fullWidth
            size="md"
            radius="xl"
            color="red"
            className=" font-[500] text-white rounded-lg py-2 mt-7 forget-password-button"
            onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </Button>
          <div
            className="flex justify-center mt-3"
            onClick={() => navigate("/login")}
          >
            <button className="font-[500] text-[#003366] rounded-lg">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
