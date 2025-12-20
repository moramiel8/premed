import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import TreeNodeContent from './TreeNodeContent'
import StepsGroup from './StepsGroup'
import TreeLink from './TreeLink/TreeLink'
import StepsLevel from './StepsLevel'

import { getNextSteps, getStepChildren } from '../../../redux/selectors/steps'
import { StepsContext } from '../StepsContext'
import useWindowDim from '../../common/useWindowDim'

function TreeNode({ step, length, duplicateParent }) {
  /* ---------- hooks that are used by other logic MUST be first ---------- */
  const { width: windowWidth } = useWindowDim()
  const ref = useRef(null)

  const nextSteps = useSelector(getNextSteps(step?._id)) || []
  const children = useSelector(getStepChildren(step?._id)) || []

  const { getTreeColor } = useContext(StepsContext)

  /* ---------- derived state ---------- */
  const isTopLevel = !step?.parent
  const isGroup = children.length > 0
  const color = getTreeColor(step?.uniData)

  /* ---------- layout ---------- */
  const nodeWidth = {
    flex: '0 0 auto',
    minWidth: windowWidth <= 650 ? '110px' : '140px',
  }

  const levelWidth = windowWidth <= 650 ? 150 : 300
  const width = nextSteps.length === 0 ? levelWidth : '100%'

  /* ---------- link positioning ---------- */
  const [divWidth, setDivWidth] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setDivWidth(ref.current.offsetWidth)
    }
  }, [windowWidth, length])

  const nodeX =
    nextSteps.length === 0
      ? 0
      : nextSteps.length % 2 === 0
      ? divWidth / (nextSteps.length + 1)
      : divWidth / nextSteps.length

  /* ---------- render ---------- */
  return (
    <div ref={ref} style={nodeWidth} className="tree-node">
      {isGroup ? (
        <StepsGroup
          parent={step}
          length={length}
          color={color}
          isTopLevel={isTopLevel}
        />
      ) : (
        <TreeNodeContent
          duplicateParent={duplicateParent}
          color={color}
          step={step}
        />
      )}

      {nextSteps.length > 0 && (
        <Fragment>
          <TreeLink
            nodeX={nodeX}
            linkWidth={divWidth}
            linkInfo={step?.linkInfo}
            nextSteps={nextSteps}
            color={color}
          />
          <StepsLevel width={width} nextSteps={nextSteps} />
        </Fragment>
      )}
    </div>
  )
}

export default TreeNode
