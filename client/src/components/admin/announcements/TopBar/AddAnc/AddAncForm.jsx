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

  // ✅ נטען מקומית מה־baseData
  const [groups, setGroups] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadGroups = async () => {
      try {
        setGroupsLoading(true)

        const res = await fetch('/api/serverdata/baseData', {
          method: 'GET',
          credentials: 'include', // חשוב אם יש auth cookies
          headers: { 'Accept': 'application/json' }
        })

        if (!res.ok) throw new Error(`baseData failed: ${res.status}`)

        const data = await res.json()
        const nextGroups = Array.isArray(data?.groups) ? data.groups : []

        if (!cancelled) setGroups(nextGroups)
      } catch (e) {
        console.error('Failed loading groups:', e)
        if (!cancelled) setGroups([])
      } finally {
        if (!cancelled) setGroupsLoading(false)
      }
    }

    // נטען רק כשהמודאל נפתח
    if (display) loadGroups()

    return () => { cancelled = true }
  }, [display])

  const options = Array.isArray(groups)
    ? groups.map(g => ({ name: g.name, value: g._id }))
    : []

  return (
    <Modal
      display={display}
      toggleModal={setDisplay}
      title="פרסום חדש"
    >
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
          placeholder={groupsLoading ? 'טוען קבוצות…' : 'בחירה'}
          title="קבוצה"
        />

        <Checkbox
          label="שליחת מייל"
          name="shouldEmail"
          onChange={handleChange}
          checked={values.shouldEmail}
        />

        <button type="submit">
          שליחה
        </button>
      </form>
    </Modal>
  )
}

export default AddAncForm
