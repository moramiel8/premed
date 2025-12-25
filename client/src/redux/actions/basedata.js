import {
  BASE_DATA_SUCCESS,
  STATS_INPUTS_LOADING,
  BASE_DATA_FAILURE,
  STATS_INPUTS_SUCCESS,
  GET_TABLE_SECTIONS,
  BASE_DATA_LOADING
} from './types';

import { api } from '../../api';
import { getError } from './messages';

export const getBaseData = () => async (dispatch) => {
  try {
    dispatch({ type: BASE_DATA_LOADING });
    const res = await api.get('/serverdata/baseData');
    dispatch({ type: BASE_DATA_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: BASE_DATA_FAILURE });
    dispatch(getError(err));
  }
};

export const getStatsInputs = (pathIds = []) => async (dispatch) => {
  try {
    dispatch({ type: STATS_INPUTS_LOADING });

    const res = await api.post('/serverdata/statsData', { pathIds });

    dispatch({ type: STATS_INPUTS_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch(getError(err));
  }
};

export const getTableSections = () => async (dispatch) => {
  try {
    dispatch({ type: STATS_INPUTS_LOADING }); // או תגדיר action נפרד אם יש לך
    const res = await api.get('/serverdata/tableSections');
    dispatch({ type: GET_TABLE_SECTIONS, payload: res.data });
  } catch (err) {
    dispatch(getError(err));
  }
};
