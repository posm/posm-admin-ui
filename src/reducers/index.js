import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import aois from "./aois";
import config from "./config";
import deployments from "./deployments";
import network from "./network";
import odm from "./odm";
import osm from "./osm";
import publicFiles from "./publicFiles";
import tasks from "./tasks";

export default combineReducers({
  aois,
  config,
  deployments,
  form,
  network,
  odm,
  osm,
  publicFiles,
  router: routerReducer,
  tasks
});
