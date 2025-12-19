import React, { useEffect, useState } from 'react'
import Modal from '../../../../layout/Modal'
import useForm from '../../../../../forms/useForm'
import { addAnc } from '../../../../../redux/announcements/ancs/actions'
import FormInput from '../../../../common/FormInput'
import Editor from '../../../../common/forms/Editor/Editor'
import Dropdown from '../../../../common/Dropdown'
import Checkbox from '../../../../common/Checkbox'

function AddAncForm({ display, setDisplay }) {
  const [defaultValues] = useState({
    title: '',
    content: '',
    group: '',
    shouldEmail: false
  })

  const { handleChange, handleSubmit, values, errors } = useForm(addAnc, defaultValues)

  const [groups, setGroups] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoadingGroups(true)
        const res = await fetch('/api/announcements/groups', {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        })
        const data = await res.json()

        const list = Array.isArray(data) ? data : (data?.groups || [])

        if (!cancelled) setGroups(list)
      } catch (e) {
        console.error('Failed to load announcement groups:', e)
        if (!cancelled) setGroups([])
      } finally {
        if (!cancelled) setLoadingGroups(false)
      }
    }

    if (display) load()
    return () => { cancelled = true }
  }, [display])

  const options = groups.map(g => ({ name: g.name, value: g._id }))

  return (
    <Modal display={display} toggleModal={setDisplay} title="פרסום חדש">
      <form onSubmit={handleSubmit}>
        <FormInput
          name="title"
          type="text"
          label="כותרת"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
        />

        <Editor
          name="content"
          value={values.content}
          onChange={(value) =>
            handleChange({ target: { name: 'content', value } })
          }
        />

        <Dropdown
          options={options}
          name="group"
          onChange={(value) =>
            handleChange({ target: { name: 'group', value } })
          }
          placeholder={loadingGroups ? 'טוען…' : 'בחירה'}
          title="קבוצה"
        />

        <Checkbox
          label="שליחת מייל"
          name="shouldEmail"
          onChange={handleChange}
          checked={values.shouldEmail}
        />

        <button type="submit">שליחה</button>
      </form>
    </Modal>
  )
}

export default AddAncForm
