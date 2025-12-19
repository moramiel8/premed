import React, { useMemo } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function Editor({ value, onChange, name, editorKey = 'default' }) {
  const initialData = useMemo(() => (value ?? ''), [editorKey]) // חשוב: תלוי ב-editorKey בלבד

  return (
    <CKEditor
      key={editorKey}
      editor={ClassicEditor}
      data={initialData}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange({ name, value: data })
      }}
    />
  )
}

export default Editor
