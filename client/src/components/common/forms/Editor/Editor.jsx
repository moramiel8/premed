import React, { useMemo } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function Editor({ value, onChange, name, editorKey = 'default' }) {
  const initialData = useMemo(() => (value ?? ''), [editorKey])

  return (
    <CKEditor
      key={editorKey}
      editor={ClassicEditor}
      data={initialData}
      onChange={(event, editor) => {
        onChange({ name, value: editor.getData() })
      }}
    />
  )
}

export default Editor
