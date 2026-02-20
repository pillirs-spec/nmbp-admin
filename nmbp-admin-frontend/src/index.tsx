import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider, Loader, createTheme } from "@mantine/core";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoaderProvider } from "./contexts/LoaderContext";
import RingLoader from "./components/common/RingLoader/RingLoader";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { LoggerProvider, ToastProvider } from "./contexts";
import { Notifications } from "@mantine/notifications";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: "ring",
      },
    }),
  },
});

root.render(
  <MantineProvider theme={theme}>
    <Notifications position="top-right" />
    <LoaderProvider>
      <LoggerProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <App />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </LoggerProvider>
    </LoaderProvider>
  </MantineProvider>,
);

reportWebVitals();
