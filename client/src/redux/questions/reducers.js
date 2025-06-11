import {
    QUEST_GROUP_LOADING,
    QUEST_GROUP_SUCCESS,
    QUEST_GROUP_ERROR,
    QUEST_GROUP_ADD,
    QUEST_GROUP_UPDATE,
    QUEST_GROUP_DELETE,
    QUEST_ADD,
    QUEST_UPDATE,
    QUEST_DELETE
} from './types';

const initialState = {
    loading: false,
    groups:[]
}

export default function(state = initialState, action) {
    const payload = action.payload

    switch(action.type) {
        case QUEST_GROUP_LOADING:
            return {
                ...state,
                loading: true
            }

        case QUEST_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                groups: payload
            }

        case QUEST_GROUP_ERROR: 
            return {
                ...state,
                loading: false,
            }

        case QUEST_GROUP_ADD:
            return {
                ...state,
                groups: [...state.groups, payload]
            }

        case QUEST_GROUP_UPDATE:
            return {
                ...state,
                loading: false,
                groups: state.groups.map(group => 
                    group.id === payload.id ? group = payload : group)
            }

        case QUEST_ADD:
            return {
                ...state,
                loading: false,
                groups: state.groups.map(group =>
                    group._id === payload.groupId 
                    ? {
                        ...group,
                        questions: [...group.questions, payload.data]
                    }
                    : group)
            }
        case QUEST_UPDATE:
            return {
                ...state,
                loading: false,
                groups: state.groups.map(group =>
                    group._id === payload.groupId 
                    ? {
                        ...group,
                        questions: group.questions.map(question =>
                            question._id === payload.questId
                            ?   payload.data : question)
                    }
                    : group)
            }

        case QUEST_DELETE:
            return {
                ...state,
                loading: false,
                groups: state.groups.map(group =>
                    group._id === payload.groupId 
                    ? {
                        ...group,
                        questions: group.questions.filter(question =>
                            question._id !== payload.questId)
                    }
                    : group)
            }

        case QUEST_GROUP_DELETE: 
            return {
                ...state,
                loading: false,
                groups: state.groups.filter(group => group.id !== payload)
            }

        default: 
            return state;
    }
}