import { Close } from '@material-ui/icons'
import React, { Fragment, useCallback } from 'react'
import { useTransition, animated } from 'react-spring'

function Alert({ display, closeAlert, isError, text }) {
  console.log('[ALERT VERSION]', '2025-12-20-NEW')
  const transition = useTransition(display, {
    from: { x: '-50%', y: 20, opacity: 0 },
    enter: { x: '-50%', y: 0, opacity: 1 },
    leave: { x: '-50%', y: 20, opacity: 0 }
  })

  const handleClose = useCallback(() => {
    if (typeof closeAlert === 'function') closeAlert()
  }, [closeAlert])

  return (
    <Fragment>
      {transition((style, item) =>
        item ? (
          <animated.div style={style} className={`alert ${isError ? 'error' : ''}`}>
            <div onClick={handleClose} className="alert__close">
              <Close />
            </div>
            <div className="alert__text">{text}</div>
          </animated.div>
        ) : null
      )}
    </Fragment>
  )
}

export default Alert
