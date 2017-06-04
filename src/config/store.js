import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";

import reducers from "../reducers";

const history = createHistory();

const store = createStore(
  reducers,
  applyMiddleware(
    routerMiddleware(history),
    createLogger({
      collapsed: true
    })
  )
);

export default store;
