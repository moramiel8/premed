import {
    SEC_LOADING,
    SEC_SUCCESS,
    SEC_ERROR,
    SEC_ADD,
    SEC_UPDATE,
    SEC_DELETE,
    ITEM_ADD,
    ITEM_UPDATE,
    ITEM_DELETE
} from '../actions/types';
import { api } from '../../api';
import { getMessage, getError } from './messages';

// Basic types
export const secLoad = () => {
    return {
        type: SEC_LOADING
    }
}

export const secSuccess = secs => {
    return {
        type: SEC_SUCCESS,
        payload: secs
    }
}

export const secError = () => {
    return {
        type: SEC_ERROR
    }
}

export const secAdd = sec => {
    return {
        type: SEC_ADD,
        payload: sec
    }
}

export const secUpdate = sec => {
    return {
        type: SEC_UPDATE,
        payload: sec
    }
}

export const secDelete = id => {
    return {
        type: SEC_DELETE,
        payload: id
    }
}

export const itemAdd = sec => {
    return {
        type: ITEM_ADD,
        payload: sec
    }
}

export const itemUpdate = sec => {
    return {
        type: ITEM_UPDATE,
        payload: sec
    }
}
export const itemDelete = sec => {
    return {
        type: ITEM_DELETE,
        payload: sec
    }
}

export const getSections = () => dispatch => {
    dispatch(secLoad());

    api.get('/sections')
         .then(res => dispatch(secSuccess(res.data)))
         .catch(err => {
             dispatch(secError());
             dispatch(getError(err));
         });
}

// Create new section
export const addSection = data => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.post('/sections', body)
         .then(res => dispatch(secAdd(res.data)))
         .catch(err => dispatch(getError(err)))
}

export const editSection = (id, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.put(`/sections/${id}`, body)
         .then(res => dispatch(secUpdate(res.data)))
         .catch(err => dispatch(getError(err)))
}

export const deleteSection = id => dispatch => {

    api.delete(`/sections/${id}`)
         .then(res => {
             dispatch(secDelete(id));
             dispatch(getMessage(res.data));
         })
         .catch(err => dispatch(getError(err)))
}

export const addItem = (sectionId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.put(`/sections/${sectionId}/item`, body)
         .then(res => dispatch(itemAdd(res.data)))
         .catch(err => dispatch(getError(err)))
}

export const editItem = (sectionId, itemId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.put(`/sections/${sectionId}/item/${itemId}`, body)
         .then(res => dispatch(itemUpdate(res.data)))
         .catch(err => dispatch(getError(err)))
}

export const deleteItem = (sectionId, itemId) => dispatch => {

    api.put(`/sections/${sectionId}/item/${itemId}/remove`)
         .then(res => dispatch(itemDelete(res.data)))
         .catch(err => dispatch(getError(err)))
}


