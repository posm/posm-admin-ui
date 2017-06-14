import path from "path";

import { createSelector } from "reselect";

export const getAvailableAOIs = state => state.aois.available || [];

export const getAOIFiles = createSelector([getAvailableAOIs], aois =>
  aois.map(({ contents, description, name, title }) => ({
    title,
    description,
    contents: Object.entries(contents).map(([file, { type }]) => ({
      file: path.join(name, file),
      type
    }))
  }))
);

export const getODMEndpoint = state => state.config.odmEndpoint;

export const getPOSMEndpoint = state => state.config.posm;
