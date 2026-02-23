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

const StatesManagement = lazy(
  () => import("./pages/Admin/StatesManagement/StatesManagement"),
);

const QrManagement = lazy(
  () => import("./pages/Admin/QrManagement/QrManagement"),
);

const AddQr = lazy(() => import("./components/AddQr/AddQr"));

const PledgeReportManagement = lazy(
  () => import("./pages/Admin/PledgeReportManagement/PledgeReportManagement"),
);

const BareauManagement = lazy(
  () => import("./pages/Admin/BureauStatusManagement/BureauStatusManagement"),
);

const UserManagement = lazy(
  () => import("./pages/Admin/UserManagement/UserManagement"),
);
const RoleManagement = lazy(
  () => import("./pages/Admin/RoleManagement/RoleManagement"),
);
const SideBarMenu = lazy(
  () => import("./components/common/SideBarMenu/SideBarMenu"),
);
// const PasswordPolicy = lazy(
//   () => import("./pages/Admin/PasswordPolicy/PasswordPolicy"),
// );

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
      {isAuthenticated && <Header />}
      <div
        className={`flex flex-col md:flex-row w-full ${isAuthenticated ? "" : ""}`}
      >
        {isAuthenticated && (
          <aside className="w-full md:w-[20%] hidden md:block sticky top-32">
            <SideBarMenu />
          </aside>
        )}
        <main
          className={`w-full ${isAuthenticated ? "" : ""} flex-1 ${
            isAuthenticated ? "md:w-[80%]" : "w-full"
          }`}
          // style={isAuthenticated ? { height: "calc(100vh - 128px)" } : {}}
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
              path="/qr-management"
              element={<PrivateRoutes element={<QrManagement />} />}
            />
            <Route
              path="/qr-management/add-qr"
              element={<PrivateRoutes element={<AddQr />} />}
            />
            <Route
              path="/state-activities"
              element={<PrivateRoutes element={<StatesManagement />} />}
            />
            <Route
              path="/pledge-reports"
              element={<PrivateRoutes element={<PledgeReportManagement />} />}
            />
            <Route
              path="/bureau-status-report"
              element={<PrivateRoutes element={<BareauManagement />} />}
            />
            <Route
              path="/role-management"
              element={<PrivateRoutes element={<RoleManagement />} />}
            />
            {/* <Route
              path="/password-policy"
              element={<PrivateRoutes element={<PasswordPolicy />} />}
            /> */}
          </Routes>
        </main>
      </div>
    </Suspense>
  );
}

export default App;
