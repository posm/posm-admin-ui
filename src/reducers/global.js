import types from "../actions";

export default (state = {}, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return {
        ...state,
        aois: {
          active: remoteState.activeAOI,
          available: remoteState["aoi-list"]
        },
        network: remoteState.network,
        osm: remoteState.osm
      };

    default:
      return state;
  }
};
