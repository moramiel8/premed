import {
    LIBRARY_LOADING,
    LIBRARY_SUCCESS,
    LIBRARY_ERROR,
    LIBRARY_ADD,
    LIBRARY_UPDATE,
    LIBRARY_DELETE,
    LIB_ITEM_ADD,
    LIB_ITEM_EDIT,
    LIB_ITEM_DELETE,
    LIB_ITEM_TOGGLE_VOTE
} from './types';
import axios from 'axios';
import { getMessage, getError } from '../actions/messages';

// Basic types
export const libraryLoad = () => {
    return {
        type: LIBRARY_LOADING
    }
}

export const libraryError = (err) => dispatch => {
    dispatch(getError(err))
    
    return dispatch({
        type: LIBRARY_ERROR
    })
}

// Get libraries by pathId
export const getLibraries = pathId => dispatch => {
    dispatch(libraryLoad());

    axios.get(`/api/libraries/${pathId}`)
         .then(res => dispatch({
             type: LIBRARY_SUCCESS,
             payload: res.data
         }))
         .catch(err => {
             dispatch(libraryError(err))
         })
}


// Create new library
export const addLibrary = data => dispatch => {
    dispatch(libraryLoad());

    // Request body
    const body = JSON.stringify(data);

    axios.post('api/libraries', body)
         .then(res => dispatch({
             type: LIBRARY_ADD,
             payload: res.data
         }))
         .catch(err => {
             dispatch(libraryError(err))
        })
}

export const editLibrary = (id, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    axios.put(`api/libraries/${id}`, body)
         .then(res => dispatch({
             type: LIBRARY_UPDATE,
             payload: res.data
         }))
         .catch(err => {
                dispatch(libraryError(err))
            })
}

export const addLibItem = (id, data) => async(dispatch) => {
    const body = JSON.stringify(data)

    try {
        const res = await axios
        .put(`api/libraries/${id}/items`, body)

        dispatch({
            type: LIB_ITEM_ADD,
            payload: {
                libId: id,
                item: res.data
            }
        })
    }
    catch(err) {
        dispatch(libraryError(err))
    }
}

export const editLibItem = (id, itemId, data) => async(dispatch) => {
    const body = JSON.stringify(data)

    try {
        const res = await axios
        .put(`api/libraries/${id}/items/${itemId}`, body)

        dispatch({
            type: LIB_ITEM_EDIT,
            payload: {
                libId: id,
                itemId,
                item: res.data
            }
        })
    }
    catch(err) {
        dispatch(libraryError(err))
    }
}

export const voteLibItem = (id, itemId, isUpvote) => async(dispatch) => {
    try {
        const res = await axios.put(`api/libraries/${id}/items/${itemId}/vote?isUpvote=${isUpvote}`)
        dispatch({
            type: LIB_ITEM_TOGGLE_VOTE,
            payload: {
                id,
                itemId,
                isUpvote,
                votes: res.data
            }
        })
    }
    catch(err) {
        dispatch(libraryError(err))
    }
}

export const deleteLibItem = (id, itemId) => async(dispatch) => {
    try {
        const res = await axios
        
        .put(`api/libraries/${id}/items/${itemId}/remove`)

        dispatch({
            type: LIB_ITEM_DELETE,
            payload: itemId
        })

        dispatch(getMessage(res.data));
    }
    catch(err) {
        dispatch(libraryError(err))
    }
}


export const deleteLibrary = id => dispatch => {
    dispatch(libraryLoad());

    axios.delete(`api/libraries/${id}`)
         .then(res => {
             dispatch({
                 type: LIBRARY_DELETE,
                 payload: id
             });
             dispatch(getMessage(res.data));
         })
         .catch(err => {
            dispatch(libraryError(err))
         })
}

