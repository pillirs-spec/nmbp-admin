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
import GovtLogo from "../../assets/naming-logo.svg";
import NamingLogo from "../../assets/naming-logo.svg";
import BannerImage from "../../assets/login-banner.svg";
import NationalEmblem from "../../assets/emblem.svg";
import "./Login.css";

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
    <div className="grid  grid-cols-12 ">
      <div className="hidden md:flex col-span-7 bg-[#E5EFF9] rounded-tr-[40px] rounded-br-[40px] relative">
        <div className="w-full relative ">
          <img
            src={GovtLogo}
            alt="govt-logo"
            className="h-28 z-50 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2"
          />
          <img
            src={BannerImage}
            alt="banner-image"
            className="absolute bottom-0 left-0"
          />
        </div>
      </div>
      <div className="bg-[#E5EFF9] md:bg-transparent col-span-12 md:col-span-5 h-screen px-5 md:px-8 py-4 overflow-y-auto flex flex-col justify-center">
        <div className="flex flex-col items-center">
          <img src={NationalEmblem} alt="national-emblem" className=" mb-4" />
          <h1 className="text-[#374151] font-semibold text-xl sm:text-4xl mt-2 !text-left">
            Log In
          </h1>
        </div>

        {/* <p className="text-[#404040] font-[500] text-lg sm:text-xl text-center">
          Login to your Admin Account
        </p> */}
        <form onSubmit={form.onSubmit(handleLogin)}>
          <div className="mt-10 mb-2 flex flex-col justify-center items-center space-y-4 ">
            <div className="w-full sm:w-3/4">
              <input
                id="mobile_number"
                maxLength={10}
                type="text"
                className="border border-[#D1D5DB]  py-3 px-4 text-sm w-full  rounded-lg outline-none"
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
                className="border border-[#D1D5DB] w-full py-3 px-4 text-sm rounded-lg outline-none"
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

            {/* <div className="w-full sm:w-3/4 flex items-center font-[600] text-[#A6A6A6] text-sm">
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
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
