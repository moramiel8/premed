export const getFieldsByArgs = (fields, calcs) => {
    const fieldArr = fields.filter(field => 
        calcs?.find(calc => calc.args.find(arg => {
            switch(arg.type) {
                case 'field':
                    return arg.role === field.role
            
                case 'group':
                    return arg.role === field.group?.role
                
                default: return false;
            }
        })))

    return fieldArr
}

export const getCalcFields = fields => {
    return fields.filter(field => field.calcOutput)
}

export const getCalcFieldsByUnis = (fields, pathId, uniId) => {
    return fields.filter(field => 
        field.calcOutput 
        && field.path === pathId
        && field.university._id === uniId)
}

export const getThreshCalcs = (state, threshes) => {
    return state.datafields.fields.filter(field => 
        threshes.find(thresh => thresh.field === field._id))
}
 