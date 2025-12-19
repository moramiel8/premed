const internalData = {
    paths: [
        {
            name: 'שש-שנתי',
            _id: 'six-year'
        },
        {
            name: 'ארבע-שנתי',
            _id: 'four-year'
        }
    ],
    universities: [
        {
            name: 'העברית',
            paths: ['six-year'],
            _id: 'huji',
            color: '#850303'
        },
        {
            name: 'תל-אביב',
            paths: ['six-year', 'four-year'],
            _id: 'tau',
            color: '#222222'
        },
        {
            name: 'טכניון',
            paths: ['six-year'],
            _id: 'tech',
            color: '#002861'
        },
        {
            name: 'בן גוריון',
            paths: ['six-year'],
            _id: 'bgu',
            color: '#f4921d'
        },
        {
            name: 'חיפה',
            paths: ['six-year'],
            _id: 'haifa',
            color: '#148991'
        },
           {
            name: 'בר אילן',
            paths: ['six-year', 'four-year'],
            _id: 'biu',
            color: '#004128'
        },
        {
            name: 'אריאל',
            paths: ['four-year'],
            _id: 'ariel',
            color: '#059394'
        }
    ]
}

export const populatePaths = pathIds => {
    return pathIds.map(pathId => internalData.paths.find(path =>
        path._id === pathId))
}

export default internalData