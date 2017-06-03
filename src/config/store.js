import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";

import reducers from "../reducers";

const middleware = () => {
  return applyMiddleware(createLogger());
};

const store = createStore(reducers, middleware());

export default store;
