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
import axios from 'axios';
import { getMessage, getError } from './messages';

// Basic types
export const stepLoad = () => {
    return {
        type: STEP_LOADING
    }
}

export const stepSuccess = steps => {
    return {
        type: STEP_SUCCESS,
        payload: steps
    }
}

export const stepError = () => {
    return {
        type: STEP_ERROR
    }
}

export const stepAdd = step => {
    return {
        type: STEP_ADD,
        payload: step
    }
}

export const stepUpdate = step => {
    return {
        type: STEP_UPDATE,
        payload: step
    }
}

export const stepDelete = id => {
    return {
        type: STEP_DELETE,
        payload: id
    }
}

// Get all steps
export const getSteps = pathId => dispatch => {
    dispatch(stepLoad());

    axios.get(`api/steps/${pathId}`)
         .then(res => dispatch(stepSuccess(res.data)))
         .catch(err => {
             dispatch(stepError());
             dispatch(getError(err));
         });
}

// Create new step
export const addStep = data => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    axios.post('api/steps/addStep', body)
         .then(res => dispatch(stepAdd(res.data)))
         .catch(err => {
            dispatch(stepError())
            dispatch(getError(err))
         })
}

export const editStep = (id, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data);

    axios.put(`api/steps/${id}`, body)
         .then(res => dispatch(stepUpdate(res.data)))
         .catch(err => {
            dispatch(getError(err))
            dispatch(stepError())
         })
}

export const addLinkLabel = (id, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/addLinkLabel`, body)
         .then(res => dispatch({
            type: STEP_ADD_LINK_LABEL,
            payload: {
                id,
                linkInfo: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const addStepSummary = (id, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/addSummary`, body)
         .then(res => dispatch({
            type: STEP_ADD_SUMMARY,
            payload: {
                id,
                summary: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const editStepSummary = (id, sumId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/${sumId}`, body)
         .then(res => dispatch({
            type: STEP_EDIT_SUMMARY,
            payload: {
                id,
                sumId,
                summary: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const removeStepSummary = (id, sumId) => dispatch => {
    axios.put(`api/steps/${id}/${sumId}/remove`)
         .then(res => {
            dispatch({
                type: STEP_REMOVE_SUMMARY,
                payload: {
                    id,
                    sumId
            }})

            dispatch(getMessage(res.data))
        })
        .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
        })
}

export const addStepSummaryGroup = (id, sumId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/${sumId}/addGroup`, body)
         .then(res => dispatch({
            type: STEP_ADD_SUMMARY_GROUP,
            payload: {
                id,
                sumId,
                group: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const addStepSummaryGroupContent = (id, sumId, groupId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)
    axios.put(`api/steps/${id}/${sumId}/${groupId}/addContent`, body)
         .then(res => dispatch({
            type: STEP_ADD_SUMMARY_CONTENT,
            payload: {
                id,
                sumId,
                groupId,
                content: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const editStepSummaryGroupContent = (id, sumId, groupId, contentId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/${sumId}/${groupId}/${contentId}`, body)
         .then(res => dispatch({
            type: STEP_EDIT_SUMMARY_CONTENT,
            payload: {
                id,
                sumId,
                groupId,
                contentId,
                content: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const removeStepSummaryGroupContent = (id, sumId, groupId, contentId) => dispatch => {
    axios.put(`api/steps/${id}/${sumId}/${groupId}/${contentId}/remove`)
         .then(res => { 
            dispatch({
                type: STEP_REMOVE_SUMMARY_CONTENT,
                payload: {
                    id,
                    sumId,
                    groupId,
                    contentId
            }})

            dispatch(getMessage(res.data))
        })
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}


export const addUniContent = (id, uniId, data) => dispatch => {
    // Request body
    const body = JSON.stringify(data)

    axios.put(`api/steps/${id}/${uniId}/addUniContent`, body)
         .then(res => dispatch({
            type: STEP_ADD_UNI_CONTENT,
            payload: {
                id,
                uniData: res.data
            }}))
         .catch(err => {
             dispatch(getError(err))
             dispatch(stepError())
         })
}

export const stepsFilterUnis = unis => dispatch => {
    dispatch({
        type: STEP_FILTER_UNIS,
        payload: unis
    })
}

export const deleteStep = id => dispatch => {
    dispatch(stepLoad());

    axios.delete(`api/steps/${id}`)
         .then(res => {
             dispatch({
                 type: STEP_DELETE,
                 payload: id
             });
             dispatch(getSteps());
             dispatch(getMessage(res.data));
         })
         .catch(err => {
            dispatch(getError(err))
            dispatch(stepError())
         })
}

