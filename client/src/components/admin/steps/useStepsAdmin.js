import { useState, useEffect } from 'react'
import useStepsGlobal from '../../steps/hooks/useStepsGlobal'
import useBaseData from '../../serverData/hooks/useBaseData'

function useStepsAdmin() {
    const [selPath, setSelPath] = useState(null)

    const selectPath = selected => {
        setSelPath(selected)
    }

    const [selStep, setSelStep] = useState(null)
    const [displayEdit, setDisplayEdit] = useState(false)

    const pathId = selPath?.value

    const toggleEdit = toggle => {
        setDisplayEdit(toggle)
    }

    const selectStep = (event, step) => {
        if (event) event.stopPropagation()
        setSelStep(step)
        setDisplayEdit(true)
    }

    const { baseData } = useBaseData()

    useEffect(() => {
        if (!selPath && baseData?.paths?.length) {
            const first = baseData.paths[0]
            setSelPath({ value: first._id, label: first.name })
        }
    }, [baseData, selPath])

    const stepsGlobal = useStepsGlobal(pathId)

    return {
        pathId,
        selectPath,
        selStep,
        selectStep,
        displayEdit,
        toggleEdit,
        isStepsAdmin: true,
        ...stepsGlobal
    }
}

export default useStepsAdmin
