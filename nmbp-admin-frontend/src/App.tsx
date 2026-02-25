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

const AddEvent = lazy(() => import("./components/AddEvent/AddEvent"));

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
      <div className={isAuthenticated ? "fixed top-0 left-0 right-0 z-50" : ""}>
        {isAuthenticated && <Header />}
      </div>
      <div
        className="flex w-full"
        style={
          isAuthenticated
            ? { marginTop: "128px", height: "calc(100vh - 128px)" }
            : {}
        }
      >
        {isAuthenticated && (
          <aside
            className="w-[20%] hidden md:block fixed left-0 overflow-y-auto border-r border-gray-300"
            style={{ top: "150px", height: "calc(100vh - 128px)" }}
          >
            <SideBarMenu />
          </aside>
        )}
        <main
          className={`w-full md:flex-1 overflow-y-auto ${
            isAuthenticated ? "md:ml-[20%]" : "w-full"
          }`}
          style={isAuthenticated ? { height: "calc(100vh - 128px)" } : {}}
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
              path="/dashboard/add-event"
              element={<PrivateRoutes element={<AddEvent />} />}
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
