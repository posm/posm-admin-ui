import types from "../actions";

const initialState = {
  projects: {}
};

export default (state = initialState, { type, projects }) => {
  switch (type) {
    case types.FETCHING_ODM_PROJECTS:
      return {
        ...state,
        loading: true
      };

    case types.RECEIVE_ODM_PROJECTS:
      return {
        ...state,
        loading: false,
        projects
      };

    default:
      return state;
  }
};
