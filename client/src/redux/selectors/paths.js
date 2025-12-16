import { createSelector } from 'reselect';

export const pathsSelector = state =>
  state.paths?.paths ?? [];

export const getAllPaths = pathsSelector;

export const getPathById = pathId => createSelector(
  pathsSelector,
  paths => paths.find(path => path._id === pathId)
);
