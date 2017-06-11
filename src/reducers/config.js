import types from "../actions";

export default (state = {}, { type, config }) => {
  switch (type) {
    case types.RECEIVE_CONFIG:
      return {
        ...state,
        ...config
      };

    default:
      return state;
  }
};
