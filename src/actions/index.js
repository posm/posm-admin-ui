import { getODMEndpoint, getPOSMEndpoint } from "../selectors";

const types = {
  FETCHING_ODM_PROJECTS: "FETCHING_ODM_PROJECTS",
  RECEIVE_CONFIG: "RECEIVE_CONFIG",
  RECEIVE_ODM_PROJECTS: "RECEIVE_ODM_PROJECTS",
  RECEIVE_POSM_STATE: "RECEIVE_POSM_STATE"
};

export default types;

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

    dispatch(loadPOSMState(config.posm));
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
