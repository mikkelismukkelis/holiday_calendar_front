import React from 'react'

import TimelineComponent from '../components/TimelineComponent'
import AppBarComponent from '../components/AppBarComponent'

const HomeView = ({ teams, team, setTeam, users, filteredUsers, setFilteredUsers }) => {
  const handleTeamSelectChange = (e) => {
    const selectedTeam = e.target.value

    setTeam(e.target.value)

    if (selectedTeam === 'All') {
      setFilteredUsers(users)
    } else {
      const filteredTeam = teams.filter((t) => t.title === selectedTeam)
      const filteredTeamId = filteredTeam[0].id

      const usersForFilter = users.filter((u) => u.group_id === filteredTeamId)

      setFilteredUsers(usersForFilter)
    }
  }

  return (
    <div className="rootDiv">
      <AppBarComponent teams={teams} team={team} setTeam={setTeam} handleTeamSelectChange={handleTeamSelectChange} />

      <TimelineComponent users={users} filteredUsers={filteredUsers} />
    </div>
  )
}

export default HomeView
