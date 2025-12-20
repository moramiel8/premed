import {
    ANC_LOADING,
    ANC_SUCCESS,
    ANC_ERROR,
    ANC_ADD,
    ANC_UPDATE,
    ANC_DELETE
} from './types';
import { getError, getMessage } from '../../actions/messages';
import { api } from '../../../api';


// Basic types
export const ancLoad = () => {
    return {
        type: ANC_LOADING
    }
}

export const ancSuccess = ancs => {
    return {
        type: ANC_SUCCESS,
        payload: ancs
    }
}

export const ancError = () => {
    return {
        type: ANC_ERROR
    }
}

export const ancAdd = anc => {
    return {
        type: ANC_ADD,
        payload: anc
    }
}

export const ancUpdate = anc => {
    return {
        type: ANC_UPDATE,
        payload: anc
    }
}

export const ancDelete = id => {
    return {
        type: ANC_DELETE,
        payload: id
    }
}

// Get anouncement
export const getAncs = () => dispatch => {
    dispatch(ancLoad());

    api
        .get('/announcements')
        .then(res => dispatch(ancSuccess(res.data)))
        .catch(err => {
            // Get message
            dispatch(ancError());
        })
}

// Get anouncement
export const getAncsList = data => dispatch => {
    dispatch(ancLoad());
    const body = JSON.stringify(data)

    api
        .post('/announcements/ancsList', body)
        .then(res => dispatch({
            type: ANC_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            // Get message
            dispatch(ancError());
        })
}


// Add new anouncement
export const addAnc = data => dispatch => {
  dispatch(ancLoad());

  return api
    .post('/announcements', data)
    .then(res => {
      dispatch(ancAdd(res.data));
      dispatch(getMessage({ he: 'הפרסום עלה בהצלחה' })); 
      return res;
    })
    .catch(err => {
      dispatch(ancError());
      dispatch(getError(err)); 
      throw err;
    });
};


// Edit anouncement
export const editAnc = (id, data) => dispatch => {
  dispatch(ancLoad());

  return api
    .put(`/announcements/${id}`, data)
    .then(res => {
      dispatch(ancUpdate(res.data));
      dispatch(getMessage({ he: 'עודכן בהצלחה' }));
      return res;
    })
    .catch(err => {
      dispatch(ancError());
      dispatch(getError(err));
      throw err;
    });
};

// Delete anouncement
export const deleteAnc = id => dispatch => {
  dispatch(ancLoad());

  return api
    .delete(`/announcements/${id}`)
    .then(res => {
      dispatch(ancDelete(id));
      dispatch(getMessage({ he: 'נמחק בהצלחה' }));
      return res;
    })
    .catch(err => {
      dispatch(ancError());
      dispatch(getError(err));
      throw err;
    });
};