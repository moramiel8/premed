import React, { useEffect, useRef } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function Editor({ value, onChange, name }) {
  const editorRef = useRef(null)
  const lastRef = useRef(value ?? '')

  useEffect(() => {
    const next = value ?? ''
    if (!editorRef.current) {
      lastRef.current = next
      return
    }

    if (next !== lastRef.current) {
      lastRef.current = next
      editorRef.current.setData(next)
    }
  }, [value])

  return (
    <CKEditor
      editor={ClassicEditor}
      data={lastRef.current}
      onReady={(editor) => {
        editorRef.current = editor
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        lastRef.current = data
        onChange({ name, value: data })
      }}
    />
  )
}

export default Editor
