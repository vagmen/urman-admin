import React from "react";
import { render } from "react-dom";
import moment from "moment";
import App from "./App";

import "./style.less";

moment.locale("ru");

render(<App />, document.getElementById("root"));
