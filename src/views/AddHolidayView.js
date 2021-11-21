import React, { useState } from 'react'
import axios from 'axios'
import { Container, Box, TextField, Stack, Button, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const envMode = process.env.NODE_ENV
const apiBaseUrl = envMode === 'development' ? 'http://localhost:5000/api' : '/api'

const addDays = (date, days) => {
  let result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const AddHolidayView = ({ users }) => {
  const [user, setUser] = useState('')
  const [holidayHeader, setHolidayHeader] = useState('')
  const [saving, setSaving] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  let navigate = useNavigate()

  const handleClickCancel = () => navigate(`/`)

  const handleClickSave = async () => {
    setSaving(true)

    if (user === '') {
      alert('Please select user')
      setSaving(false)
      return
    }

    if (startDate === null || endDate === null) {
      alert('Starting and ending times must be selected')
      setSaving(false)
      return
    }

    if (startDate >= endDate) {
      alert('Ending time should be later than starting time')
      setSaving(false)
      return
    }

    const selectedUser = users.filter((u) => u.title === user)

    const groupId = selectedUser[0].id

    const title = holidayHeader === '' ? '-' : holidayHeader

    // Extract date information from date object - start
    let modifiedStartDate = startDate
    modifiedStartDate.setHours(startDate.getHours() + 3)
    const startTimeIsoString = modifiedStartDate.toISOString()
    const startTimeYear = startTimeIsoString.substring(0, 4)
    const startTimeMonth = startTimeIsoString.substring(5, 7)
    const startTimeDay = startTimeIsoString.substring(8, 10)
    const startTime = startTimeYear + startTimeMonth + startTimeDay

    // Extract date information from date object - end
    let modifiedEndDate = addDays(endDate, 1)
    modifiedEndDate.setHours(endDate.getHours() + 3)
    const endTimeIsoString = modifiedEndDate.toISOString()
    const endTimeYear = endTimeIsoString.substring(0, 4)
    const endTimeMonth = endTimeIsoString.substring(5, 7)
    const endTimeDay = endTimeIsoString.substring(8, 10)
    const endTime = endTimeYear + endTimeMonth + endTimeDay

    const holidayData = { group: groupId, title: title, start_time: startTime, end_time: endTime }

    try {
      const res = await axios.post(`${apiBaseUrl}/items`, holidayData)
      // console.log(res.data)
      if (res.data.message === 'SomeSpecific Message') {
        setSaving(false)
        alert('Something')
      } else {
        setSaving(false)
        navigate(`/`)
      }
    } catch (error) {
      setSaving(false)
      console.log(error)
    }
  }

  const handleUserChange = (e) => {
    setUser(e.target.value)
  }

  const handleHolidayHeaderChange = (e) => {
    setHolidayHeader(e.target.value)
  }

  return (
    <Container className="add-container">
      <Box component="form" noValidate autoComplete="off">
        <FormControl fullWidth className="user-select">
          <InputLabel id="user-select-label">user</InputLabel>
          <Select labelId="user-select-label" id="user-select" value={user} label="Select" onChange={handleUserChange}>
            {users.map((u) => {
              return (
                <MenuItem key={u.id} value={u.title}>
                  {u.title}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <TextField
          className="add-input"
          id="holiday-title"
          label="Holiday/absence header, Optional"
          value={holidayHeader}
          onChange={handleHolidayHeaderChange}
          fullWidth
        />

        <div id="datepickers">
          <DatePicker
            id="start-picker"
            dateFormat="dd.MM.yyyy"
            placeholderText="Select starting date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            calendarStartDay={1}
          />
          <DatePicker
            id="end-picker"
            dateFormat="dd.MM.yyyy"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Select ending date"
            calendarStartDay={1}
          />
        </div>
        <Stack spacing={10} direction="row" className="add-holiday-button-stack">
          <Button onClick={handleClickCancel} className="big-button" variant="contained">
            Cancel
          </Button>

          {saving ? <CircularProgress /> : null}

          <Button onClick={handleClickSave} className="big-button" variant="contained">
            Add holiday/absence
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default AddHolidayView
