import types from "../actions";

const initialState = {
  active: null,
  available: []
};

export default (state = initialState, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return {
        ...state,
        active: remoteState.activeAOI,
        available: remoteState["aoi-list"]
      };

    default:
      return state;
  }
};
