import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import reducers from "../reducers";

const history = createHistory();

const store = createStore(
  reducers,
  applyMiddleware(
    routerMiddleware(history),
    thunk,
    createLogger({
      collapsed: true
    })
  )
);

export default store;
