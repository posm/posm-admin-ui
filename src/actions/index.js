const types = {
  RECEIVE_POSM_STATE: "RECEIVE_POSM_STATE"
};

export default types;

export const receivePOSMState = () => {
  return dispatch => {
    // TODO don't hard-code me
    return fetch("http://posm.local/posm-admin/status")
      .then(rsp => rsp.json())
      .then(remoteState => {
        return dispatch({
          type: types.RECEIVE_POSM_STATE,
          remoteState
        });
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };
};
