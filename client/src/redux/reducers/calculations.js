import {
    CALC_LOADING,
    CALC_SUCCESS,
    CALC_ERROR,
    CALC_ADD,
    CALC_UPDATE,
    CALC_DELETE,
    STORED_CALCS_GET,
    CALC_ASSIGN_ROLE
} from '../actions/types';

const initialState = {
    loading: false,
    calcs: [],
    storedCalcs: []
}

export default function(state = initialState, action) {
    const payload = action.payload;

    switch(action.type) {
        case CALC_LOADING:
            return {
                ...state,
                loading: true
            }

        case CALC_SUCCESS: 
            return {
                ...state,
                loading: false,
                calcs: payload
            }

        case CALC_ERROR:
            return {
                ...state,
                loading: false,
            }

        case CALC_ADD:
            return {
                ...state,
                loading: false,
                calcs: [...state.calcs, payload]
            }

        case CALC_UPDATE:
            return {
                ...state,
                loading: false,
                calcs: state.calcs.map(calc => calc._id === payload._id 
                    ? calc = payload : calc)
            }

        case CALC_ASSIGN_ROLE:
            return {
                ...state,
                loading: false,
                calcs: state.calcs.map(calc => {
                    let tempCalc = payload.find(curCalc => 
                        curCalc._id === calc._id)
                    
                    return tempCalc ? calc = tempCalc : calc
                })
            }

        case CALC_DELETE:
            return {
                ...state,
                loading: false,
                calcs: state.calcs.filter(calc => calc._id !== payload)
            }
        
        case STORED_CALCS_GET: 
            return {
                ...state,
                loading: false,
                storedCalcs: payload
            }

        default:
            return state;
    }
}