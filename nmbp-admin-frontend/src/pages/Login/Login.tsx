import { useForm, yupResolver } from "@mantine/form";
import React, { useState } from "react";
import { loginValidations } from "./loginValidations";
import HeaderLogo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth, useLogger, useToast } from "../../hooks";
import { encDec } from "../../utils";
import { LogLevel, ToastType } from "../../enums";
import { loginService } from "./loginService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { log } = useLogger();
  const { setUserTokenToContext, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validationSchema = loginValidations.validateLoginWithPassword();

  const form = useForm({
    initialValues: {
      mobile_number: "",
      password: "",
    },
    validate: yupResolver(validationSchema),
  });

  const handleLogin = async (values: {
    mobile_number: string;
    password: string;
  }) => {
    try {
      const encryptedPassword = encDec.encrypt(values.password);
      const response = await loginService.loginWithPassword(
        values.mobile_number,
        encryptedPassword,
      );

      if (response.data && response.data.data) {
        await login();
        setUserTokenToContext(response.data.data.token);
        showToast("Login Successful", "Success", ToastType.SUCCESS);
      }

      log(LogLevel.INFO, "Login :: handleLogin", response);
    } catch (error) {
      log(LogLevel.ERROR, "Login :: handleLogin", error);
    }
  };

  const handleLoginWithOtp = () => {
    navigate("/otp-login");
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  return (
    <div className="w-full h-screen bg-white flex justify-center items-center px-5 md:px-0 overflow-hidden">
      <div className="w-[400px] lg:w-[450px] shadow shadow-gray-400 rounded-[32px] px-5 py-4">
        <div className="flex justify-center">
          <img src={HeaderLogo} alt="Temple Logo" className="h-20 w-20 mb-4" />
        </div>
        <h1 className="text-[#003366] font-bold text-3xl sm:text-4xl text-center mt-2 mb-5">
          Admin Login
        </h1>
        {/* <p className="text-[#404040] font-[500] text-lg sm:text-xl text-center">
          Login to your Admin Account
        </p> */}
        <form onSubmit={form.onSubmit(handleLogin)}>
          <div className="mt-10 mb-2 flex flex-col justify-center items-center space-y-4">
            <div className="w-full sm:w-3/4">
              <input
                id="mobile_number"
                maxLength={10}
                type="text"
                className="border  py-3 px-4 text-sm w-full bg-[#F0F0F0] rounded-3xl outline-none"
                error={form.errors.user_name}
                {...form.getInputProps("mobile_number")}
                placeholder="Mobile Number"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  form.setFieldValue("mobile_number", onlyNums);
                }}
                onPaste={(e) => {
                  const pastedValue = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(pastedValue)) {
                    e.preventDefault();
                  }
                }}
              />
              {/* <input
                id="mobile_number"
                type="text"
                className="border py-3 px-4 text-sm w-full bg-[#F0F0F0] rounded-3xl outline-none"
                {...form.getInputProps("mobile_number")}
                placeholder="Enter username"
                onChange={(e) => {
                  const onlyText = e.target.value.replace(/[0-9]/g, "");
                  form.setFieldValue("mobile_number", onlyText);
                }}
              /> */}

              {form.errors.mobile_number && (
                <p className="text-red-600 font-[500] text-xs mt-1">
                  {form.errors.mobile_number}
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-3/4">
              <input
                id="password"
                maxLength={25}
                type={showPassword ? "text" : "password"}
                className="border w-full py-3 px-4 text-sm  bg-[#F0F0F0] rounded-3xl outline-none"
                error={form.errors.password}
                {...form.getInputProps("password")}
                placeholder="Password"
              />
              {showPassword ? (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className="absolute top-4 right-4 cursor-pointer"
                  color="#003366"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEye}
                  className="absolute top-4 right-4 cursor-pointer"
                  color="#003366"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}

              {form.errors.password && (
                <p className="text-red-600 font-[500] text-xs mt-1">
                  {form.errors.password}
                </p>
              )}
            </div>

            <div className="w-full sm:w-3/4 flex justify-end items-center">
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={handleForgotPassword}
              >
                <FontAwesomeIcon
                  color="#003366"
                  icon={faLock}
                  className="relative top-[1px]"
                />
                <p className="text-xs font-[500] text-[#003366]">
                  Forgot Password
                </p>
              </div>
            </div>
            <div className="w-full sm:w-3/4">
              <button
                type="submit"
                className="bg-[#003366] font-[500] text-white w-full rounded-lg py-2"
              >
                Sign In
              </button>
            </div>

            <div className="w-full sm:w-3/4 flex items-center font-[600] text-[#A6A6A6] text-sm">
              <hr className="flex-grow border-[#A6A6A6]" />
              <span className="mx-4 text-gray-500">OR</span>
              <hr className="flex-grow border-[#A6A6A6]" />
            </div>
            <div className="w-full sm:w-3/4 mb-5">
              <button
                className="bg-transparent border border-[#003366] font-[500] text-[#003366] w-full rounded-lg py-2"
                onClick={handleLoginWithOtp}
              >
                Login Using OTP
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
