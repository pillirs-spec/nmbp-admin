import "./App.css";
import { Suspense, lazy } from "react";
import LoadingFallBack from "./components/common/LoadingFallBack/LoadingFallBack";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./components/common/PublicRoutes/PublicRoutes";
import { useAuth, useLoader, useLogger, useToast } from "./hooks";
import { setupInterceptors } from "./api/axiosConfig";
import { LogLevel } from "./enums";

const Form = lazy(() => import("./pages/Form/Form"));

function App() {
  // const { userToken, isAuthenticated, logout } = useAuth();
  const { userToken, logout } = useAuth();
  // const location = useLocation();
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const { setLogLevel, log } = useLogger();

  setupInterceptors(
    userToken || "",
    logout,
    showLoader,
    hideLoader,
    showToast,
    log,
  );
  setLogLevel(LogLevel.INFO);
  return (
    <Suspense fallback={<LoadingFallBack />}>
      <Routes>
        <Route path="/" element={<PublicRoutes element={<Form />} />} />
      </Routes>
    </Suspense>
  );
}

export default App;
