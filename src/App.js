import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Routes, Route } from 'react-router-dom'

import HomeView from './views/HomeView'
import AddHolidayView from './views/AddHolidayView'
import AddUserView from './views/AddUserView'
import AddTeamView from './views/AddTeamView'
import Online from './views/Online'

const envMode = process.env.NODE_ENV
const apiBaseUrl = envMode === 'development' ? 'http://localhost:5000/api' : '/api'

const initUsers = [{ id: 1, title: 'No connection do DB' }]

function App() {
  const [teams, setTeams] = useState([])
  const [team, setTeam] = useState('All')
  const [users, setUsers] = useState(initUsers)
  const [filteredUsers, setFilteredUsers] = useState(initUsers)

  const getTeamData = () => {
    axios
      .get(`${apiBaseUrl}/teams`)
      .then((res) => setTeams(res.data))
      .catch((error) => console.log('Error in getting team data, error: ', error))
  }

  const getUserData = () => {
    axios
      .get(`${apiBaseUrl}/users`)
      .then((res) => {
        setUsers(res.data)
        setFilteredUsers(res.data)
      })
      .catch((error) => console.log('Error in getting users data, error: ', error))
  }

  useEffect(() => {
    getTeamData()
  }, [])

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={<HomeView teams={teams} team={team} setTeam={setTeam} users={users} filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} />}
      />
      <Route path="addholiday" element={<AddHolidayView users={users} />} />
      <Route path="adduser" element={<AddUserView teams={teams} getUserData={getUserData} />} />
      <Route path="addteam" element={<AddTeamView getTeamData={getTeamData} />} />
      <Route path="online" element={<Online />} />
    </Routes>
  )
}
export default App
