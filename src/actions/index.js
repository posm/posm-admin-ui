import { getODMEndpoint, getPOSMEndpoint } from "../selectors";

const types = {
  FETCHING_ODM_PROJECTS: "FETCHING_ODM_PROJECTS",
  RECEIVE_CONFIG: "RECEIVE_CONFIG",
  RECEIVE_ODM_PROJECTS: "RECEIVE_ODM_PROJECTS",
  RECEIVE_POSM_STATE: "RECEIVE_POSM_STATE"
};

export default types;

export const loadPOSMState = () => (dispatch, getState) => {
  fetch(`${getPOSMEndpoint(getState())}/posm-admin/status`, {
    credentials: "same-origin"
  })
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
};

export const initializeState = () => dispatch =>
  fetch("/config.json", {
    credentials: "same-origin"
  })
    .then(rsp => rsp.json())
    .then(config => {
      dispatch({
        type: types.RECEIVE_CONFIG,
        config
      });

      dispatch(loadPOSMState(config.posm));
    })
    .catch(err => console.warn(err));

export const activateAOI = ({ aoi, url }) => (dispatch, getState) => {
  let body = {
    url
  };

  if (aoi !== "other") {
    body = {
      aoi
    };
  }

  fetch(`${getPOSMEndpoint(getState())}/posm-admin/aoi-deploy`, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).catch(err => console.warn(err));
};

export const backup = () => (dispatch, getState) => {
  fetch(`${getPOSMEndpoint(getState())}/posm-admin/backup-data`, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).catch(err => console.warn(err));
};

export const createDeployment = url => (dispatch, getState) => {
  fetch(`${getPOSMEndpoint(getState())}/posm-admin/atlas-deploy`, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url
    })
  }).catch(err => console.warn(err));
};

export const updateNetworkConfig = body => (dispatch, getState) => {
  fetch(`${getPOSMEndpoint(getState())}/posm-admin/network-config`, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).catch(err => console.warn(err));
};

export const getODMProjects = () => (dispatch, getState) => {
  const endpoint = getODMEndpoint(getState());

  if (endpoint == null) {
    return;
  }

  dispatch({
    type: types.FETCHING_ODM_PROJECTS
  });

  fetch(`${endpoint}/projects`, {
    credentials: "same-origin"
  })
    .then(rsp => rsp.json())
    .then(projects =>
      dispatch({
        type: types.RECEIVE_ODM_PROJECTS,
        projects
      })
    )
    .catch(err => console.warn(err));
};

export const createODMProject = projectName => (dispatch, getState) => {
  const endpoint = getODMEndpoint(getState());

  if (endpoint == null || !projectName) {
    return;
  }

  fetch(`${endpoint}/projects`, {
    credentials: "same-origin",
    body: JSON.stringify({
      name: projectName
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "PUT"
  })
    .then(rsp => dispatch(getODMProjects()))
    .catch(err => console.warn(err.stack));
};
