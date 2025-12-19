import React, { useMemo } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function Editor({ value, onChange, name }) {
  const initialData = useMemo(() => (value ?? ''), []) // פעם אחת

  return (
    <CKEditor
      editor={ClassicEditor}
      data={initialData}
      onChange={(event, editor) => {
        onChange({ name, value: editor.getData() })
      }}
    />
  )
}

export default Editor
