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

// aoi:bend_posm_export
export const activateAOI = (posm, { aoi, url }) => dispatch => {
  let body = {
    url
  };

  if (aoi !== "other") {
    body = {
      aoi
    };
  }

  fetch(`${posm}/posm-admin/aoi-deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
    // TODO monitor state
  }).then(rsp => dispatch(loadPOSMState(posm)));
};

export const backup = posm => dispatch =>
  fetch(`${posm}/posm-admin/backup-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
    // TODO monitor state
  }).catch(err => console.warn(err));

export const createDeployment = (posm, url) => dispatch =>
  fetch(`${posm}/posm-admin/atlas-deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url
    })
    // TODO monitor state
  }).then(rsp => dispatch(loadPOSMState(posm)));

export const updateNetworkConfig = (posm, body) => dispatch =>
  fetch(`${posm}/posm-admin/network-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
    // TODO monitor state
  }).then(rsp => dispatch(loadPOSMState(posm)));
