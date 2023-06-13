import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import store from "./app/store.js"
import { Provider } from "react-redux"
import "./main.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
