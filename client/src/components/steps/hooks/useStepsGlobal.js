import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { stepsFilterUnis } from '../../../redux/actions/steps'
import { getStepsByUnis } from '../../../redux/selectors/steps'
import { getUnisByPath } from '../../../redux/selectors/unis'
import { addOrRemove } from '../../../utils/arrays'
import { isSingleMatch } from './utils'

function useStepsGlobal(pathId) {
  const unis = useSelector(getUnisByPath(pathId))
  const [selUnis, setSelUnis] = useState([])

  // ✅ תיקון: פונקציה אחת בלבד
  const selectUni = (uniObj) => {
    const stageUnis = addOrRemove(selUnis, uniObj.value)
    setSelUnis(stageUnis)
  }

  // ✅ תיקון: לרוץ גם כשה-Unis נטענים
  useEffect(() => {
    if (pathId && unis?.length) {
      setSelUnis(unis.map((uni) => uni._id))
    }
  }, [pathId, unis])

  const dispatch = useDispatch()
  const steps = useSelector(getStepsByUnis(selUnis))

  // (מומלץ) לא לחסום dispatch על length>0 כדי לא להשאיר מצב "תקוע"
  useEffect(() => {
    dispatch(stepsFilterUnis(selUnis))
  }, [selUnis, dispatch])

  const getTreeColor = (uniData) => {
    const baseColor = '#6FC3C8'
    const singleUni = isSingleMatch(uniData, selUnis)

    if (singleUni) {
      const color = unis?.find((uni) => singleUni === uni._id)?.color
      return color || baseColor
    }

    return baseColor
  }

  const getUniContent = (step) => {
    const uniData = step?.uniData
    const uniContent = {}

    if (uniData) {
      for (let uniItem of uniData) {
        if (uniItem.content?.length > 0) {
          uniContent[uniItem.uni] = uniItem.content
        }
      }
    }

    return uniContent
  }

  const isFinal = (step) => {
    const uniData = step.uniData[0]
    return step.uniData.length === 1 && uniData.isFinal
  }

  return {
    unis,
    selUnis,
    selectUni,
    getTreeColor,
    steps,
    getUniContent,
    isFinal
  }
}

export default useStepsGlobal
