import types from "../actions";

const initialState = {
  userDetails: {}
};

export default (state = initialState, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_USER_DETAILS:
      return {
        ...state,
        userDetails: remoteState
      };

    default:
      return state;
  }
};
