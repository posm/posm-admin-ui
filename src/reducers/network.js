import types from "../actions";

const initialState = {
  wan: {},
  lan: {},
  wlan: {},
  wifi: {}
};

export default (state = initialState, { type, remoteState: network }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return {
        ...state,
        network
      };

    default:
      return state;
  }
};
