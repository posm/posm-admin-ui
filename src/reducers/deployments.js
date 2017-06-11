import types from "../actions";

export default (state = [], { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      return remoteState.deployments;

    default:
      return state;
  }
};
