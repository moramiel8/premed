import { staticDataTypes } from '../../allowedTypes';

const {
    fieldTypes,
    validationTypes,
    dataTypes,
} = staticDataTypes


const fields = [
    {
        name: 'סטטוס קבלה',
        _id: 'acceptStatusBiuSix',
        dataType: dataTypes.str,
        fieldType: fieldTypes.select,
        paths: ['six-year'],
        uni: 'biu',
        fieldOptions: [
            {
                name: 'קבלה',
                value: 'accept',
            },
            {
                name: 'המתנה',
                value: 'pending',
            },
            {
                name: 'דחייה',
                value: 'reject',
            }
        ]
    },
    {
        name: 'סכם ראשוני',
        _id: 'biuInitialFour',
        threshField: true,
        dataType: dataTypes.num,
        fieldType: fieldTypes.textbox,
        paths: ['four-year'],
        uni: 'biu',
        validators: [
            validationTypes.isPosNum,
            {
                ...validationTypes.numRange,
                min: '150',
                max: '250'
            }
        ]
    },
    {
        name: 'סכם סופי',
        _id: 'biuFinalFour',
        threshField: true,
        dataType: dataTypes.num,
        fieldType: fieldTypes.textbox,
        paths: ['four-year'],
        uni: 'biu',
        validators: [
            validationTypes.isPosNum,
            {
                ...validationTypes.numRange,
                min: '150',
                max: '250'
            }
        ]
    },
    {
        name: 'סטטוס קבלה',
        _id: 'acceptStatusbiuFour',
        dataType: dataTypes.str,
        fieldType: fieldTypes.select,
        paths: ['four-year'],
        uni: 'biu',
        fieldOptions: [
            {
                name: 'קבלה',
                value: 'accept',
            },
            {
                name: 'המתנה',
                value: 'pending',
            },
            {
                name: 'דחייה',
                value: 'reject',
            }
        ]
    }
]

export default fields