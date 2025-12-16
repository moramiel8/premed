import React, { useState } from 'react'
import Modal from '../../../../layout/Modal'
import useForm from '../../../../../forms/useForm'
import { addAnc } from '../../../../../redux/announcements/ancs/actions'
import FormInput from '../../../../common/FormInput'
import Editor from '../../../../common/forms/Editor/Editor'
import Dropdown from '../../../../common/Dropdown'
import { useSelector } from 'react-redux'
import Checkbox from '../../../../common/Checkbox'
import { getGroups } from '../../../../../redux/announcements/groups/selectors'



function AddAncForm({ display, setDisplay }) {
    const [defaultValues] = useState({
        title: '',
        content: '',
        group: '',
        shouldEmail: false
    })

    const {
        handleChange,
        handleSubmit,
        values,
        errors
    } = useForm(addAnc, defaultValues)

    console.log('AddAncForm values:', values);
    console.log('AddAncForm errors:', errors);

    const groups = useSelector(getGroups) || [];

const options = Array.isArray(groups)
  ? groups.map(group => ({
      name: group.name,
      value: group._id
    }))
  : [];

  console.log('FORM VALUES', values);

    return (
        <Modal
        display={display}
        toggleModal={setDisplay}
        title="פרסום חדש">
           <form
  onSubmit={(e) => {
    console.log('SUBMIT CLICK');
    console.log('values at submit:', values);
    console.log('errors at submit:', errors);
    handleSubmit(e);
  }}
>

                <FormInput
                name="title"
                type="text"
                label="כותרת"
                value={values.title}
                onChange={handleChange}
                error={errors.title} />

                <Editor
                name="content"
                value={values.content}
                onChange={(value) =>
                handleChange({
                target: { name: 'content', value }
                  })
                }
                />

               <Dropdown
               options={options}
               name="group"
               onChange={(value) =>
               handleChange({ target: { name: 'group', value } })
              }
             placeholder="בחירה"
             title="קבוצה"
                />


                <Checkbox
                label="שליחת מייל"
                name="shouldEmail"
                onChange={handleChange}
                checked={values.shouldEmail} />

                <button type="submit">
                    שליחה
                </button>
            </form>
        </Modal>
    )
}

export default AddAncForm
