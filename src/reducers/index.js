import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import aois from "./aois";
import config from "./config";
import deployments from "./deployments";
import network from "./network";
import odm from "./odm";
import osm from "./osm";
import publicFiles from "./publicFiles";
import user from "./user";
import tasks from "./tasks";

export default combineReducers({
  aois,
  config,
  deployments,
  user,
  form,
  network,
  odm,
  osm,
  publicFiles,
  tasks
});
