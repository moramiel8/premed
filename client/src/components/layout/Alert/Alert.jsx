import { Close } from '@material-ui/icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const EXIT_MS = 220

function Alert({ display, closeAlert, isError, text }) {
  const handleClose = useCallback(() => {
    if (typeof closeAlert === 'function') closeAlert()
  }, [closeAlert])

  const [mounted, setMounted] = useState(Boolean(display))
  const [visible, setVisible] = useState(Boolean(display))
  const tRef = useRef(null)

  useEffect(() => {
    if (display) {
      if (tRef.current) clearTimeout(tRef.current)
      setMounted(true)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      tRef.current = setTimeout(() => setMounted(false), EXIT_MS)
    }

    return () => {
      if (tRef.current) clearTimeout(tRef.current)
    }
  }, [display])

  if (!mounted) return null

  return (
    <div className={`alert ${isError ? 'error' : ''} ${visible ? 'is-visible' : ''}`}>
      <div onClick={handleClose} className="alert__close">
        <Close />
      </div>
      <div className="alert__text">{text}</div>
    </div>
  )
}

export default Alert
