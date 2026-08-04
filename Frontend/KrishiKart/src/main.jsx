import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import AuthProvider from "./context/AuthProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/css/global.css";
import "./assets/css/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);