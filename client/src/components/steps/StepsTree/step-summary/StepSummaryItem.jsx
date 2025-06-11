import React, { useContext, useState } from 'react'
import { StepsContext } from '../../StepsContext';
import StepSummaryTop from './StepSummaryTop';
import SummaryGroupContent from './SummaryGroups/SummaryGroupContent';

function StepSummaryItem({ summary, stepId }) {
    const [displayEdit, setDisplayEdit] = useState(false);

    const toggleDisplay = toggle => {
        if(isStepsAdmin) {
            setDisplayEdit(toggle)
        }
    }

    const {
        isStepsAdmin
    } = useContext(StepsContext)

    const [displayGroups, setDisplayGroups] = useState(false)

    const toggleGroups = toggle => {
        setDisplayGroups(toggle)
    }

    return (
        <div className={`step-summary-item
        ${isStepsAdmin ? 'admin' : 'client'}`}>
            <StepSummaryTop
            display={displayEdit}
            toggleDisplay={toggleDisplay}
            displayGroups={displayGroups}
            toggleGroups={toggleGroups}
            stepId={stepId}
            summary={summary} />

            <SummaryGroupContent
            display={displayGroups} 
            toggleGroups={toggleGroups}
            stepId={stepId}
            sumId={summary._id}
            groups={summary.groups}/>
        </div>
    )
}

export default StepSummaryItem
