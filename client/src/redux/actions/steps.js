import {
  STEP_LOADING,
  STEP_SUCCESS,
  STEP_ERROR,
  STEP_ADD,
  STEP_UPDATE,
  STEP_DELETE,
  STEP_ADD_LINK_LABEL,
  STEP_ADD_SUMMARY,
  STEP_EDIT_SUMMARY,
  STEP_REMOVE_SUMMARY,
  STEP_ADD_SUMMARY_GROUP,
  STEP_ADD_SUMMARY_CONTENT,
  STEP_EDIT_SUMMARY_CONTENT,
  STEP_REMOVE_SUMMARY_CONTENT,
  STEP_ADD_UNI_CONTENT,
  STEP_FILTER_UNIS
} from './types';

import { api } from '../../api';
import { getMessage, getError } from './messages';

const successMsg = (he) => getMessage({ he });

// Basic types
export const stepLoad = () => ({
  type: STEP_LOADING
});

export const stepSuccess = (steps) => ({
  type: STEP_SUCCESS,
  payload: steps
});

export const stepError = () => ({
  type: STEP_ERROR
});

export const stepAdd = (step) => ({
  type: STEP_ADD,
  payload: step
});

export const stepUpdate = (step) => ({
  type: STEP_UPDATE,
  payload: step
});

export const stepDelete = (id) => ({
  type: STEP_DELETE,
  payload: id
});

// Get all steps
export const getSteps = (pathId) => (dispatch) => {
  dispatch(stepLoad());

  if (!pathId) {
    dispatch(stepSuccess([]));
    return;
  }

  api.get(`/steps/${pathId}`)
    .then((res) => dispatch(stepSuccess(res.data)))
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

// Create new step
export const addStep = (data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.post('/steps/addStep', body)
    .then((res) => {
      dispatch(stepAdd(res.data));
      dispatch(successMsg('נוסף שלב בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const editStep = (id, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}`, body)
    .then((res) => {
      dispatch(stepUpdate(res.data));
      dispatch(successMsg('עודכן בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const addLinkLabel = (id, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/addLinkLabel`, body)
    .then((res) => {
      dispatch({
        type: STEP_ADD_LINK_LABEL,
        payload: {
          id,
          linkInfo: res.data
        }
      });
      dispatch(successMsg('עודכן בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const addStepSummary = (id, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/addSummary`, body)
    .then((res) => {
      dispatch({
        type: STEP_ADD_SUMMARY,
        payload: {
          id,
          summary: res.data
        }
      });
      dispatch(successMsg('נוסף בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const editStepSummary = (id, sumId, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/${sumId}`, body)
    .then((res) => {
      dispatch({
        type: STEP_EDIT_SUMMARY,
        payload: {
          id,
          sumId,
          summary: res.data
        }
      });
      dispatch(successMsg('עודכן בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const removeStepSummary = (id, sumId) => (dispatch) => {
  api.put(`/steps/${id}/${sumId}/remove`)
    .then(() => {
      dispatch({
        type: STEP_REMOVE_SUMMARY,
        payload: {
          id,
          sumId
        }
      });
      dispatch(successMsg('נמחק בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const addStepSummaryGroup = (id, sumId, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/${sumId}/addGroup`, body)
    .then((res) => {
      dispatch({
        type: STEP_ADD_SUMMARY_GROUP,
        payload: {
          id,
          sumId,
          group: res.data
        }
      });
      dispatch(successMsg('נוסף בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const addStepSummaryGroupContent = (id, sumId, groupId, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/${sumId}/${groupId}/addContent`, body)
    .then((res) => {
      dispatch({
        type: STEP_ADD_SUMMARY_CONTENT,
        payload: {
          id,
          sumId,
          groupId,
          content: res.data
        }
      });
      dispatch(successMsg('נוסף בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const editStepSummaryGroupContent = (id, sumId, groupId, contentId, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/${sumId}/${groupId}/${contentId}`, body)
    .then((res) => {
      dispatch({
        type: STEP_EDIT_SUMMARY_CONTENT,
        payload: {
          id,
          sumId,
          groupId,
          contentId,
          content: res.data
        }
      });
      dispatch(successMsg('עודכן בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const removeStepSummaryGroupContent = (id, sumId, groupId, contentId) => (dispatch) => {
  api.put(`/steps/${id}/${sumId}/${groupId}/${contentId}/remove`)
    .then(() => {
      dispatch({
        type: STEP_REMOVE_SUMMARY_CONTENT,
        payload: {
          id,
          sumId,
          groupId,
          contentId
        }
      });
      dispatch(successMsg('נמחק בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const addUniContent = (id, uniId, data) => (dispatch) => {
  const body = JSON.stringify(data);

  api.put(`/steps/${id}/${uniId}/addUniContent`, body)
    .then((res) => {
      dispatch({
        type: STEP_ADD_UNI_CONTENT,
        payload: {
          id,
          uniData: res.data
        }
      });
      dispatch(successMsg('נוסף בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};

export const stepsFilterUnis = (unis) => (dispatch) => {
  dispatch({
    type: STEP_FILTER_UNIS,
    payload: unis
  });
};

export const deleteStep = (id) => (dispatch) => {
  dispatch(stepLoad());

  api.delete(`/steps/${id}`)
    .then(() => {
      dispatch(stepDelete(id));
      dispatch(successMsg('נמחק בהצלחה'));
    })
    .catch((err) => {
      dispatch(stepError());
      dispatch(getError(err));
    });
};
