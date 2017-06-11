const types = {
  RECEIVE_CONFIG: "RECEIVE_CONFIG",
  RECEIVE_POSM_STATE: "RECEIVE_POSM_STATE"
};

export default types;

export const loadPOSMState = posmEndpoint => dispatch =>
  fetch(`${posmEndpoint}/posm-admin/status`)
    .then(rsp => rsp.json())
    .then(remoteState =>
      dispatch({
        type: types.RECEIVE_POSM_STATE,
        remoteState
      })
    )
    .catch(err => {
      console.warn(err.stack);
    });

export const initializeState = () => dispatch =>
  fetch("/config.json")
    .then(rsp => rsp.json())
    .then(config => {
      dispatch({
        type: types.RECEIVE_CONFIG,
        config
      });

      dispatch(loadPOSMState(config.posm));
    })
    .catch(err => {
      console.warn(err.stack);
    });
