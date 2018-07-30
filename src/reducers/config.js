import types from "../actions";

export default (
  state = {
    imageryAvailable: false,
    odmAvailable: false
  },
  { type, available, config }
) => {
  switch (type) {
    case types.RECEIVE_CONFIG:
      return {
        ...state,
        ...config
      };

    case types.RECEIVE_IMAGERY_STATUS:
      return {
        ...state,
        imageryAvailable: available
      };

    case types.RECEIVE_ODM_STATUS:
      return {
        ...state,
        odmAvailable: available
      };

    default:
      return state;
  }
};
