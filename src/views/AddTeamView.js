import React, { useState } from 'react'
import axios from 'axios'
import { Container, Box, TextField, Stack, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const envMode = process.env.NODE_ENV
const apiBaseUrl = envMode === 'development' ? 'http://localhost:5000/api' : '/api'

const AddTeamView = ({ getTeamData }) => {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  let navigate = useNavigate()

  const handleClickCancel = () => navigate(`/`)

  const handleClickSave = async () => {
    setSaving(true)

    if (name.length < 3) {
      alert('Team name should have at least 3 characers')
      setSaving(false)
      return
    }

    const teamData = { title: name }

    try {
      const res = await axios.post(`${apiBaseUrl}/teams`, teamData)
      // console.log(res.data)
      if (res.data.message === 'TeamFoundFromDatabase') {
        setSaving(false)
        alert('Selected team already found from database')
      } else {
        setSaving(false)
        getTeamData()
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

  return (
    <Container className='add-container'>
      <Box component='form' noValidate autoComplete='off'>
        <TextField className='add-input' id='name' label='Team name' value={name} onChange={handleNameChange} fullWidth />

        <Stack spacing={10} direction='row' className='add-user-button-stack'>
          <Button onClick={handleClickCancel} className='big-button' variant='contained'>
            Cancel
          </Button>

          {saving ? <CircularProgress /> : null}

          <Button onClick={handleClickSave} className='big-button' variant='contained'>
            Add Team
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default AddTeamView
