import React, { useState } from 'react'
import Modal from '../../../../layout/Modal'
import useForm from '../../../../../forms/useForm'
import { editLibItem } from '../../../../../redux/libraries/actions'
import FormInput from '../../../../common/FormInput'
import UrlInput from '../../../../common/forms/UrlInput/UrlInput'
import IconsSelect from '../IconSelect/IconsSelect'
import Editor from '../../../../common/forms/Editor/Editor'
import AddMeta from '../AddItem/AddMeta';

function EditItem({ display, setDisplay, item, libId }) {
    const [defaultValues] = useState({
        ...item
    })
    
    const {
        handleChange,
        handleSubmit,
        values,
        errors
    } = useForm(editLibItem, defaultValues, libId, item._id)

    return (
        <Modal
        title={`עריכת ${item.name}`}
        display={display}
        toggleModal={setDisplay}>
            <form onSubmit={handleSubmit}>
                <FormInput
                label="שם"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name} />

                <AddMeta
                handleChange={handleChange}
                values={values}
                errors={errors} />
    
                <UrlInput
                url={values.link}
                onChange={handleChange}
                name="link" />

                <IconsSelect
                value={values.icon}
                onChange={handleChange} />

                {display &&
                    <Editor
                    value={values.info}
                    onChange={handleChange}
                    name="info" />                    
                }

                <button>
                    עריכה
                </button>
            </form>
        </Modal>
    )
}

export default EditItem
