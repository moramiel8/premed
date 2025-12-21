import { Close } from '@material-ui/icons'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../../../redux/selectors/auth'
import SideMenu from '../../../SideMenu/SideMenu'
import Logout from './Logout/Logout'
import SideBarLinks from './SideBarLinks/SideBarLinks'
import { userdataSelector } from '../../../../../redux/selectors/userdata'

const formatLastEdited = (dateString) => {
  if (!dateString) return null
  const d = new Date(dateString)

  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
  const dayName = days[d.getDay()]
  const date = d.toLocaleDateString('he-IL')
  const time = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

  return `נערך לאחרונה ב־${dayName}, ${date}, ${time}`
}

function SideBar({ display, setDisplay }) {
  const user = useSelector(selectUser)
  const userdata = useSelector(userdataSelector)

  console.log('userdataSelector ->', userdata)


  const lastUpdated =
    userdata?.data?.tableData?.last_updated || userdata?.data?.updatedAt

  return (
    <SideMenu display={display} setDisplay={setDisplay}>
      <div className="side-bar">
        <div className="side-bar__top">
          <div className="side-bar__top__title">
            <div
              onClick={() => setDisplay(false)}
              className="side-bar__top__title__close"
            >
              <Close style={{ fontSize: 20 }} />
            </div>
            <span>{`שלום, ${user.firstName}`}</span>
          </div>
          <SideBarLinks />
        </div>

        <div className="side-bar__bottom">
          {lastUpdated && (
            <div className="side-bar__last-updated">
              {formatLastEdited(lastUpdated)}
            </div>
          )}
          <Logout />
        </div>
      </div>
    </SideMenu>
  )
}

export default SideBar
