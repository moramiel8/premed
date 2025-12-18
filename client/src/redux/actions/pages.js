import {
    PAGE_LOADING,
    PAGE_SUCCESS,
    PAGE_ERROR,
    PAGE_ADD,
    PAGE_UPDATE,
    PAGE_DELETE,
    PAGE_LINK_ADD,
    PAGE_LINK_UPDATE,
    PAGE_LINK_DELETE
} from './types';
import { api } from '../../api';
import { getMessage, getError } from './messages';

// Basic types
export const pageLoad = () => {
    return {
        type: PAGE_LOADING
    }
}

export const pageError = () => {
    return {
        type: PAGE_ERROR
    }
}

// Get all pages
export const getPages = () => dispatch => {
    dispatch(pageLoad());

    api.get('/pages')
         .then(res => dispatch({
             type: PAGE_SUCCESS,
             payload: res.data
         }))
         .catch(err => {
             dispatch(pageError());
             dispatch(getError(err));
         });
}

// Create new page
export const addPage = data => dispatch => {
    dispatch(pageLoad());

    // Request body
    const body = JSON.stringify(data);

    api.post('/pages', body)
         .then(res => dispatch({
             type: PAGE_ADD,
             payload: res.data
         }))
         .catch(err => dispatch(getError(err)))
}

export const editPage = (id, data) => dispatch => {
    dispatch(pageLoad());
    
    // Request body
    const body = JSON.stringify(data);

    api.put(`/pages/${id}`, body)
         .then(res => dispatch({
             type: PAGE_UPDATE,
             payload: res.data
         }))
         .catch(err => dispatch(getError(err)))
}

export const deletePage = id => dispatch => {
    dispatch(pageLoad());

    api.delete(`/pages/${id}`)
         .then(res => {
             dispatch({
                 type: PAGE_DELETE,
                 payload: id
             });
             dispatch(getMessage(res.data));
         })
         .catch(err => {
            dispatch(pageError())
            dispatch(getError(err))
         })
}

// Links
export const addPageLink = (pageId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.put(`/pages/${pageId}/addLink`, body)
         .then(res => dispatch({
             type: PAGE_LINK_ADD,
             payload: res.data
         }))
         .catch(err => dispatch(getError(err)))
}

export const editSubpageLink = (pageId, linkId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    api.put(`/pages/${pageId}/${linkId}`, body)
         .then(res => dispatch({
             type: PAGE_LINK_UPDATE,
             payload: res.data
         }))
         .catch(err => dispatch(getError(err)))
}

export const deleteSubpageLink = (pageId, linkId) => dispatch => {

    api.put(`/pages/${pageId}/${linkId}/remove`)
         .then(res => dispatch({
             type: PAGE_LINK_DELETE,
             payload: res.data
         }))
         .catch(err => dispatch(getError(err)))
}