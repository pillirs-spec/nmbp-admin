import { createRoot } from "react-dom/client";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter as Router } from "react-router-dom";

import { LoaderProvider } from "./contexts/LoaderProvider";
import { LoggerProvider } from "./contexts/LoggerProvider";
import { ToastProvider } from "./contexts/ToastProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import App from "./App";

// const theme = createTheme({
//   components: {
//     Loader: Loader.extend({
//       defaultProps: {
//         loaders: { ...Loader.defaultLoaders, ring: RingLoader },
//         type: "ring",
//       },
//     }),
//   },
// });

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
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
