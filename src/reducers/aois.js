import types from "../actions";

const initialState = {
  available: []
};

export default (state = initialState, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return {
        active: remoteState.activeAOI,
        available: remoteState["aoi-list"]
      };

    default:
      return state;
  }
};
