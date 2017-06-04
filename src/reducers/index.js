import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import aois from "./aois";
import global from "./global";
import network from "./network";
import osm from "./osm";

const reducer = combineReducers({
  aois,
  network,
  osm,
  router: routerReducer
});

// export a custom reducer function so that globally-reduced values can be hoisted
export default (state = {}, action) => ({
  ...reducer(global(state, action), action)
});
