import "./App.css";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PublicRoutes from "./components/common/PublicRoutes/PublicRoutes";
import PrivateRoutes from "./components/common/PrivateRoutes/PrivateRoutes";
import "react-datepicker/dist/react-datepicker.css";
import { setupInterceptors } from "./api/axiosConfig";
import { useLoader } from "./hooks/useLoader";
import { useToast } from "./hooks/useToast";
import { useAuth, useLogger } from "./hooks";
import { LogLevel } from "./enums";
import LoadingFallback from "./components/common/LoadingFallback/LoadingFallback";

const Header = lazy(() => import("./components/common/Header/Header"));
const Login = lazy(() => import("./pages/Login/Login"));
const OtpLogin = lazy(() => import("./pages/Login/OtpLogin/OtpLogin"));
const ForgetPassword = lazy(
  () => import("./pages/Login/ForgetPassword/ForgetPassword"),
);
const ResetPassword = lazy(
  () => import("./pages/Login/ResetPassword/ResetPassword"),
);

const Dashboard = lazy(() => import("./pages/Admin/Dashboard/Dashboard"));

const UserManagement = lazy(
  () => import("./pages/Admin/UserManagement/UserManagement"),
);
const RoleManagement = lazy(
  () => import("./pages/Admin/RoleManagement/RoleManagement"),
);
const SideBarMenu = lazy(
  () => import("./components/common/SideBarMenu/SideBarMenu"),
);
const PasswordPolicy = lazy(
  () => import("./pages/Admin/PasswordPolicy/PasswordPolicy"),
);

function App() {
  const { userToken, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const { setLogLevel, log } = useLogger();

  setupInterceptors(userToken, logout, showLoader, hideLoader, showToast, log);
  setLogLevel(LogLevel.INFO);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Header />
      <div className="flex flex-col md:flex-row w-full">
        {isAuthenticated && (
          <aside className="w-full md:w-[20%] hidden md:block ">
            <SideBarMenu />
          </aside>
        )}
        <main
          className={`w-full h-screen relative ${
            isAuthenticated
              ? "md:w-[80%] sm:w-[100%] xs:w-[100%] pt-20 sm:pt-16 md:pt-20"
              : ""
          } ${!location.state ? "" : ""}`}
        >
          <Routes>
            <Route
              path="/"
              element={<PublicRoutes element={<Navigate to="/login" />} />}
            />
            <Route
              path="/login"
              element={<PublicRoutes element={<Login />} />}
            />

            <Route
              path="/otp-login"
              element={<PublicRoutes element={<OtpLogin />} />}
            />
            <Route
              path="/forget-password"
              element={<PublicRoutes element={<ForgetPassword />} />}
            />
            <Route
              path="/reset-password"
              element={<PublicRoutes element={<ResetPassword />} />}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoutes element={<Dashboard />} />}
            />
            <Route
              path="/user-management"
              element={<PrivateRoutes element={<UserManagement />} />}
            />
            <Route
              path="/role-management"
              element={<PrivateRoutes element={<RoleManagement />} />}
            />
            <Route
              path="/password-policy"
              element={<PrivateRoutes element={<PasswordPolicy />} />}
            />
          </Routes>
        </main>
      </div>
    </Suspense>
  );
}

export default App;
