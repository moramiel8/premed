import React, { useRef, useState } from 'react'
import MoreVert from '@material-ui/icons/MoreVert'
import Menu from '../../../../common/Menu/Menu'
import EditAnc from './EditAnc'
import VerifyDelete from '../../../../common/VerifyDelete'
import { deleteAnc } from '../../../../../redux/announcements/ancs/actions'
import useOnClickOutside from '../../../../common/useOnClickOutside'

function AncOptions({ anc }) {
  const [displayMenu, setDisplayMenu] = useState(false)
  const [displayDelete, setDisplayDelete] = useState(false)
  const [displayEdit, setDisplayEdit] = useState(false)

  const openEdit = () => {
    setDisplayEdit(true)
    setDisplayMenu(false)
  }

  const openDelete = () => {
    setDisplayDelete(true)
    setDisplayMenu(false)
  }

  const options = [
    { name: 'עריכה', action: openEdit },
    { name: 'מחיקה', action: openDelete }
  ]

  const ref = useRef(null)
  useOnClickOutside(ref, displayMenu, () => setDisplayMenu(false))

  return (
    <div ref={ref} className="anc-item__top__options">
      <MoreVert
        onClick={() => setDisplayMenu(!displayMenu)}
        style={{ fontSize: 20 }}
      />

      <Menu display={displayMenu}>
        {options.map((option, index) => (
          <div key={index} onClick={option.action}>
            {option.name}
          </div>
        ))}
      </Menu>

      {/* ✅ Edit modal */}
      <EditAnc
        anc={anc}
        display={displayEdit}
        setDisplay={setDisplayEdit}
      />

      <VerifyDelete
        callback={deleteAnc}
        values={[anc._id]}
        display={displayDelete}
        toggleModal={setDisplayDelete}
      />
    </div>
  )
}

export default AncOptions
