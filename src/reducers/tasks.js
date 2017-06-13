import types from "../actions";

const initialState = {
  aois: {},
  backup: {},
  deployments: {}
};

export default (state = initialState, { type, remoteState }) => {
  switch (type) {
    case types.RECEIVE_POSM_STATE:
      const {
        "aoi-deploy": { complete: aoiComplete, initialized: aoiInitialized },
        "atlas-deploy": {
          complete: atlasComplete,
          initialized: atlasInitialized
        },
        "backup-data": {
          complete: backupComplete,
          initialized: backupInitialized
        }
      } = remoteState;

      return {
        aois: {
          complete: aoiComplete,
          running: aoiInitialized && !aoiComplete
        },
        backup: {
          complete: backupComplete,
          running: backupInitialized && !backupComplete
        },
        deployments: {
          complete: atlasComplete,
          running: atlasInitialized && !atlasComplete
        }
      };

    default:
      return state;
  }
};
