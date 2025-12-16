import {
    UNI_LOADING,
    UNI_SUCCESS,
    UNI_ERROR,
    UNI_ADD,
    UNI_UPDATE,
    UNI_DELETE,
} from './types';
import { api } from '../../api';
import { getMessage, getError } from './messages';

// Basic types
export const uniLoad = () => {
    return {
        type: UNI_LOADING
    }
}

export const uniError = () => {
    return {
        type: UNI_ERROR
    }
}


// Get unis by paths
export const getUnisByPaths = data => dispatch => {
    dispatch(uniLoad());

    const params = JSON.stringify(data)

    axios.get(`/api/universities/${params}`)
         .then(res => dispatch({
             type: UNI_SUCCESS,
             payload: res.data
         }))
         .catch(err => {
             dispatch(uniError())
             dispatch(getMessage(err))
         })
}

// Get all universities
export const getUnis = () => dispatch => {
    dispatch(uniLoad());

    api.get('/universities')
         .then(res => { 
             dispatch({
                type: UNI_SUCCESS,
                payload: res.data
            })})
         .catch(err => {
             dispatch(uniError());
             dispatch(getError(err));
         });
}

// Create new university
export const addUni = data => dispatch => {
    dispatch(uniLoad());

    // Request body
    const body = JSON.stringify(data);

    api.post('/universities', body)
         .then(res => {
             dispatch ({
                type: UNI_ADD,
                payload: res.data
             })})
         .catch(err => {
             dispatch(uniError())
             dispatch(getError(err))
            })
}

export const editUni = (id, data) => dispatch => {
    dispatch(uniLoad());
    
    // Request body
    const body = JSON.stringify(data);

    axios.put(`api/universities/${id}`, body)
         .then(res => 
            dispatch({
                type: UNI_UPDATE,
                payload: res.data
             }))
         .catch(err => {
             dispatch(uniError())
             dispatch(getError(err))
            })
}

export const deleteUni = id => dispatch => {
    dispatch(uniLoad());

    axios.delete(`api/universities/${id}`)
         .then(res => {
             dispatch({
                type: UNI_DELETE,
                payload: id
             })
             dispatch(getMessage(res.data))
         })
         .catch(err => {
            dispatch(uniError())
            dispatch(getError(err))
         })
}

