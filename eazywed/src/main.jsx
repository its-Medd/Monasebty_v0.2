import LocaleProvider from "./i18n/LocaleProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@fontsource-variable/alexandria";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./index.css";
import "./styles/service-form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/experience.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

import "./i18n/arabic.css";
import "./pages/common/MobileNavigation.css";
