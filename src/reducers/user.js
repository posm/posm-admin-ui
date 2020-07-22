import types from "../actions";

const initialState = {
  userDetails: {}
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case types.RECEIVE_USER_DETAILS: {
      const { remoteState } = action;
      return {
        ...state,
        userDetails: remoteState
      };
    }
    default:
      return state;
  }
};
