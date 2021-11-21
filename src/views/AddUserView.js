import React, { useState } from 'react'
import axios from 'axios'
import { Container, Box, TextField, Stack, Button, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const envMode = process.env.NODE_ENV
const apiBaseUrl = envMode === 'development' ? 'http://localhost:5000/api' : '/api'

const AddUserView = ({ teams, getUserData }) => {
  const [name, setName] = useState('')
  const [team, setTeam] = useState('')
  const [saving, setSaving] = useState(false)

  let navigate = useNavigate()

  const handleClickCancel = () => navigate(`/`)

  const handleClickSave = async () => {
    setSaving(true)

    if (name.length < 3) {
      alert('Name should have at least 3 characers')
      setSaving(false)
      return
    }

    if (team === '') {
      alert('Please select team')
      setSaving(false)
      return
    }

    const selectedTeam = teams.filter((t) => t.title === team)

    const userData = { group_id: selectedTeam[0].id, title: name }

    try {
      const res = await axios.post(`${apiBaseUrl}/users`, userData)
      // console.log(res.data)
      if (res.data.message === 'UserFoundFromDatabase') {
        setSaving(false)
        alert('Selected team already contains person with that name')
      } else {
        setSaving(false)
        getUserData()
        navigate(`/`)
      }
    } catch (error) {
      setSaving(false)
      console.log(error)
    }
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleTeamChange = (e) => {
    setTeam(e.target.value)
  }

  return (
    <Container className="add-container">
      <Box component="form" noValidate autoComplete="off">
        <TextField className="add-input" id="name" label="Name: Lastname Firstname" value={name} onChange={handleNameChange} fullWidth />

        <FormControl fullWidth>
          <InputLabel id="team-select-label">Team</InputLabel>
          <Select labelId="team-select-label" id="team-select" value={team} label="Select" onChange={handleTeamChange}>
            {teams.map((t) => {
              return (
                <MenuItem key={t.id} value={t.title}>
                  {t.title}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <Stack spacing={10} direction="row" className="add-user-button-stack">
          <Button onClick={handleClickCancel} className="big-button" variant="contained">
            Cancel
          </Button>

          {saving ? <CircularProgress /> : null}

          <Button onClick={handleClickSave} className="big-button" variant="contained">
            Add user
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default AddUserView
