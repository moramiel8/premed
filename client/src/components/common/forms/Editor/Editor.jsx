import React, { useMemo } from 'react'
import CKEditorModule from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const CKEditorComp =
  CKEditorModule?.CKEditor ||
  CKEditorModule?.default ||
  CKEditorModule

function Editor({ value, onChange, name, editorKey = 'default' }) {
  const initialData = useMemo(() => (value ?? ''), [editorKey])

  if (!CKEditorComp) {
    console.error('CKEditor component is undefined. Check @ckeditor/ckeditor5-react export.')
    return null
  }

  return (
    <CKEditorComp
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
