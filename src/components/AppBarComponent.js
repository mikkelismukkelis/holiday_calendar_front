import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AppBar, Toolbar, FormControl, InputLabel, Select, MenuItem, Stack, Button } from '@mui/material'

const AppBarComponent = ({ teams, team, handleTeamSelectChange }) => {
  let navigate = useNavigate()

  const handleClickAddHoliday = () => navigate(`/addholiday`)
  const handleClickAddTeam = () => navigate(`/addteam`)
  const handleClickAddUser = () => navigate(`/adduser`)

  return (
    <div>
      <AppBar position='static' className='app-bar'>
        <Toolbar className='tool-bar'>
          <FormControl className='form-control' fullWidth>
            <InputLabel id='team-select-label'>Team</InputLabel>
            <Select labelId='team-select-label' id='team-select' value={team} label='Team' onChange={handleTeamSelectChange}>
              <MenuItem value={'All'}>All</MenuItem>
              {teams.map((t) => {
                return (
                  <MenuItem key={t.id} value={t.title}>
                    {t.title}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Stack spacing={10} direction='row' className='button-stack'>
            <Button onClick={handleClickAddHoliday} className='button' variant='contained'>
              Add absence/holiday
            </Button>
            <Button onClick={handleClickAddTeam} className='button' variant='contained'>
              Add team
            </Button>
            <Button onClick={handleClickAddUser} className='button' variant='contained'>
              Add user
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default AppBarComponent
