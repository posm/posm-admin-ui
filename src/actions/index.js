import {
  getImageryEndpoint,
  getODMEndpoint,
  getPOSMEndpoint
} from "../selectors";

// TODO: Fetch this from enviornment variable
export const posmAdminEndpoint = "http://localhost:8050";

const types = {
  FETCHING_ODM_PROJECTS: "FETCHING_ODM_PROJECTS",
  RECEIVE_CONFIG: "RECEIVE_CONFIG",
  RECEIVE_IMAGERY_STATUS: "RECEIVE_IMAGERY_STATUS",
  RECEIVE_ODM_PROJECTS: "RECEIVE_ODM_PROJECTS",
  RECEIVE_ODM_STATUS: "RECEIVE_ODM_STATUS",
  RECEIVE_POSM_STATE: "RECEIVE_POSM_STATE",
  RECEIVE_USER_DETAILS: "RECEIVE_USER_DETAILS"
};

export default types;

export const loadUserDetails = () => async (dispatch, getState) => {
  try {
    const rsp = await fetch(`${posmAdminEndpoint}/users/me/`, {
      credentials: "include"
    });

    dispatch({
      type: types.RECEIVE_USER_DETAILS,
      remoteState: await rsp.json()
    });
  } catch (err) {
    console.warn(err);
  }
};

export const loadPOSMState = () => async (dispatch, getState) => {
  try {
    const rsp = await fetch(
      `${getPOSMEndpoint(getState())}/posm-admin/status`,
      {
        credentials: "same-origin"
      }
    );

    dispatch({
      type: types.RECEIVE_POSM_STATE,
      remoteState: await rsp.json()
    });
  } catch (err) {
    console.warn(err);
  }
};

export const loadImageryStatus = () => async (dispatch, getState) => {
  const endpoint = getImageryEndpoint(getState());

  if (endpoint == null) {
    return dispatch({
      type: types.RECEIVE_IMAGERY_STATUS,
      available: false
    });
  }

  try {
    const rsp = await fetch(`${endpoint}/imagery`, {
      credentials: "same-origin"
    });

    dispatch({
      type: types.RECEIVE_IMAGERY_STATUS,
      available: rsp.ok
    });
  } catch (err) {
    dispatch({
      type: types.RECEIVE_IMAGERY_STATUS,
      available: false
    });
  }
};

export const loadODMStatus = () => async (dispatch, getState) => {
  const endpoint = getODMEndpoint(getState());

  if (endpoint == null) {
    dispatch({
      type: types.RECEIVE_ODM_STATUS,
      available: false
    });
  }

  try {
    const rsp = await fetch(`${endpoint}/projects`, {
      credentials: "same-origin"
    });

    dispatch({
      type: types.RECEIVE_ODM_STATUS,
      available: rsp.ok
    });
  } catch (err) {
    dispatch({
      type: types.RECEIVE_ODM_STATUS,
      available: false
    });
  }
};

export const initializeState = () => async dispatch => {
  try {
    const rsp = await fetch("/config.json", {
      credentials: "same-origin"
    });

    const config = await rsp.json();

    dispatch({
      type: types.RECEIVE_CONFIG,
      config
    });

    dispatch(loadPOSMState());
    dispatch(loadImageryStatus());
    dispatch(loadODMStatus());
  } catch (err) {
    console.warn(err);
  }
};

export const activateAOI = ({ aoi, url }) => async (dispatch, getState) => {
  let body = {
    url
  };

  if (aoi !== "other") {
    body = {
      aoi
    };
  }

  try {
    await fetch(`${getPOSMEndpoint(getState())}/posm-admin/aoi-deploy`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn(err);
  }
};

export const backup = () => async (dispatch, getState) => {
  try {
    await fetch(`${getPOSMEndpoint(getState())}/posm-admin/backup-data`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.warn(err);
  }
};

export const createDeployment = url => async (dispatch, getState) => {
  try {
    await fetch(`${getPOSMEndpoint(getState())}/posm-admin/atlas-deploy`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url
      })
    });
  } catch (err) {
    console.warn(err);
  }
};

export const updateNetworkConfig = body => async (dispatch, getState) => {
  try {
    await fetch(`${getPOSMEndpoint(getState())}/posm-admin/network-config`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn(err);
  }
};

export const getODMProjects = () => async (dispatch, getState) => {
  const endpoint = getODMEndpoint(getState());

  if (endpoint == null) {
    return;
  }

  dispatch({
    type: types.FETCHING_ODM_PROJECTS
  });

  try {
    const rsp = await fetch(`${endpoint}/projects`, {
      credentials: "same-origin"
    });

    dispatch({
      type: types.RECEIVE_ODM_PROJECTS,
      projects: await rsp.json()
    });
  } catch (err) {
    console.warn(err);
  }
};

export const createODMProject = projectName => async (dispatch, getState) => {
  const endpoint = getODMEndpoint(getState());

  if (endpoint == null || !projectName) {
    return;
  }

  try {
    await fetch(`${endpoint}/projects`, {
      credentials: "same-origin",
      body: JSON.stringify({
        name: projectName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT"
    });

    dispatch(getODMProjects());
  } catch (err) {
    console.warn(err);
  }
};
