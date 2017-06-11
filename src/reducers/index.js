import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import aois from "./aois";
import config from "./config";
import deployments from "./deployments";
import network from "./network";
import osm from "./osm";

export default combineReducers({
  aois,
  config,
  deployments,
  form,
  network,
  osm,
  router: routerReducer
});
