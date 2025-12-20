import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../../../../layout/Modal'
import useForm from '../../../../../forms/useForm'
import { editAnc } from '../../../../../redux/announcements/ancs/actions'
import FormInput from '../../../../common/FormInput'
import Editor from '../../../../common/forms/Editor/Editor'
import Dropdown from '../../../../common/Dropdown'
import Checkbox from '../../../../common/Checkbox'
import { useDispatch } from 'react-redux'
import { setErrorMessage } from '../../../../../redux/actions/messages'

function EditAnc({ anc, display, setDisplay }) {
  const dispatch = useDispatch()

  const [defaultValues, setDefaultValues] = useState({
    title: '',
    content: '',
    group: '',
    shouldEmail: false
  })

  // טוען קבוצות כמו ב-AddAncForm
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

  const options = useMemo(
    () => groups.map(g => ({ name: g.name, value: g._id })),
    [groups]
  )

  // כשפותחים עריכה, נמלא את ברירת המחדל מה-anc
  useEffect(() => {
    if (!display || !anc) return

    setDefaultValues({
      title: anc.title || '',
      content: anc.content || '',
      // אם anc.group מאוכלס (populate) יש anc.group._id, אחרת זה כבר id
      group: anc.group
        ? {
            name: anc.group?.name || '',
            value: anc.group?._id || anc.group
          }
        : '',
      shouldEmail: !!anc.shouldEmail
    })
  }, [display, anc])

  const { handleChange, handleSubmit, values, errors } = useForm(
    (data) => editAnc(anc._id, data),
    defaultValues
  )

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!values.group?.value) {
      dispatch(setErrorMessage('חייב לבחור קבוצה', 400))
      return
    }

    try {
      await handleSubmit(e)
      setDisplay(false)
    } catch (err) {
      // editAnc כבר עושה getError (אם תיקנת שם dispatch), אז לא חייבים פה
    }
  }

  return (
    <Modal display={display} toggleModal={setDisplay} title="עריכת פרסום">
      <form onSubmit={onSubmit}>
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
          editorKey={`edit-announcement-${anc?._id || 'unknown'}`}
          onChange={({ name, value }) =>
            handleChange({ target: { name, value } })
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

        <button type="submit">שמירה</button>
      </form>
    </Modal>
  )
}

export default EditAnc
