const stepMessages = {
    SuccessDelete: {
        msg: {
            en: 'Step was successfully deleted',
            he: 'השלב נמחק בהצלחה'
        },
        status: 200
    },
    SummarySuccessDelete: {
        msg: {
            en: 'Summary successfully deleted',
            he: 'הסיכום נמחק בהצלחה'
        },
        status: 200
    },
    GroupSuccessDelete: {
        msg: {
            en: 'Summary group successfully deleted',
            he: 'קבוצת הסיכום נמחקה בהצלחה'
        },
        status: 200
    },
    ContentSuccessDelete: {
        msg: {
            en: 'Summary group content successfully deleted',
            he: 'התוכן נמחק בהצלחה'
        },
        status: 200
    },
    StepNotExist: {
        msg: {
            en: 'Step does not exist',
            he: 'השלב לא קיים'
        },
        status: 404
    },
    ParentNotExist: {
        msg: {
            en: 'Parent step does not exist',
            he: 'השלב שכולל שלב זה אינו קיים'
        },
        status: 404
    },
    PrevStepNotExist: {
        msg: {
            en: 'Previous step linked does not exist',
            he: 'השלב הקודם שקושר לשלב זה אינו קיים'
        },
        status: 404 
    },
    StrangerLinking: {
        msg: {
            en: 'Cannot link steps with different paths or parents',
            he: 'לא ניתן לקשר שלבים עם מסלולים או הורים שונים'
        },
        status: 400
    }
}

module.exports = stepMessages;