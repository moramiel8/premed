import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { stepsFilterUnis } from '../../../redux/actions/steps'
import { getUnisByPath } from '../../../redux/selectors/unis'
import { stepsSelector } from '../../../redux/selectors/steps'   // <-- שים לב: זה קיים אצלך
import { addOrRemove } from '../../../utils/arrays'
import { isSingleMatch } from './utils'

function useStepsGlobal(pathId) {
  const unisSelector = useMemo(() => getUnisByPath(pathId), [pathId])
  const unis = useSelector(unisSelector)

  const [selUnis, setSelUnis] = useState([])

  const selectUni = (uniObj) => {
    const stageUnis = addOrRemove(selUnis, uniObj.value)
    setSelUnis(stageUnis)
  }

  useEffect(() => {
    if (pathId && unis?.length) {
      const next = unis.map((u) => u._id)
      if (next.join('|') !== selUnis.join('|')) {
        setSelUnis(next)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathId, unis])

  const dispatch = useDispatch()

  const steps = useSelector(stepsSelector)

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
