import { staticDataTypes } from '../../allowedTypes';

const {
    fieldTypes,
    dataTypes,
} = staticDataTypes


const fields = [
    {
        name: 'סטטוס קבלה',
        _id: 'acceptStatusHaifa',
        dataType: dataTypes.str,
        fieldType: fieldTypes.select,
        paths: ['six-year'],
        uni: 'haifa',
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