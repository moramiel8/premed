import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { StepsContext } from '../StepsContext'
import StepsLevel from './StepsLevel'
import StepSummary from './step-summary/StepSummary'
import { getFirstSteps } from '../../../redux/selectors/steps'
 
function StepsGroup({ length, parent, isTopLevel, color, childrenGroup }) {
    const {
        selectStep
    } = useContext(StepsContext)

    const firstSteps = useSelector(getFirstSteps(parent?._id))

    const groupStyle = {
        backgroundColor: color + '20'
    }

    const groupNameStyle = {
        color,
        borderColor: color + '90'
    }

    let duplicateMaskStyle = {
        position: 'absolute',
        height: "165.7px",
        right: 0,
        top: "-165.7px",
        width: "100%"
    }

    if(length === 1) {
        duplicateMaskStyle = {
            ...duplicateMaskStyle,
            height: "85.5px",
            top: "-85.5px",
        }
    }

    const duplicateSize = {
        height: 70 + 'px'
    }

    const isDuplicate = length > 1 && parent.duplicate

    return (
        <div 
        style={parent.duplicate ? duplicateSize : {}}
        className={`steps-group 
        ${isTopLevel ?  'top-level' : 'nested'}`}>
            <div 
            className={`wrapper 
            ${isTopLevel ?  'top-level' : 'nested'}`}
            style={!isTopLevel ? groupStyle : {}}>
                {parent.duplicate &&
                    <div
                    style={{
                        ...groupStyle,
                        ...duplicateMaskStyle
                    }}
                    className="steps-group-duplicate-mask"></div>
                }
                {!parent.duplicate &&
                    <div 
                    style={groupNameStyle}
                    onClick={e => selectStep(e, parent)}
                    className="steps-group-name">
                        <span>
                            {parent.name}
                        </span>
                    </div>
                }
                <div 
                className="group-content">
                    {firstSteps?.length > 0 &&
                        <StepsLevel 
                        childrenGroup={childrenGroup}
                        duplicateParent={isDuplicate}
                        isGroup={true}
                        nextSteps={firstSteps} />
                    }

                    <StepSummary
                    color={color}
                    stepId={parent._id}
                    summaries={parent.summaries} />     
                </div>
            </div>
        </div>  
    )
}

export default StepsGroup
