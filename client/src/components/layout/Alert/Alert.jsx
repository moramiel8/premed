import { Close } from '@material-ui/icons'
import React, { Fragment, useCallback } from 'react'
import { useTransition, animated } from 'react-spring'

function Alert({ display, closeAlert, isError, text }) {
  const handleClose = useCallback(() => {
    if (typeof closeAlert === 'function') closeAlert()
  }, [closeAlert])

  const transitions = useTransition(display, {
    from: { opacity: 0, transform: 'translate(-50%, 20px)' },
    enter: { opacity: 1, transform: 'translate(-50%, 0px)' },
    leave: { opacity: 0, transform: 'translate(-50%, 20px)' }
  })

  return (
    <Fragment>
      {transitions((style, item) =>
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
