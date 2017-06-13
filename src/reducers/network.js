import types from "../actions";

const initialState = {
  wan: {},
  lan: {},
  wlan: {},
  wifi: {}
};

export default (state = initialState, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return {
        ...state,
        ...remoteState.network,
        changing: remoteState["network-config"].initialized
      };

    default:
      return state;
  }
};
