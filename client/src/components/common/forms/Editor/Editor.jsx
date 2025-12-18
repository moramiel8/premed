import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Editor({ value, onChange, name }) {

    const handleChange = data => {
        onChange({
            name,
            value: data
        })
    }

    return (
      <CKEditor
  editor={ClassicEditor}
  data={value ?? ''}
  onChange={(event, editor) => {
    onChange({ name, value: editor.getData() });
  }}
/>


    )
}

export default Editor
