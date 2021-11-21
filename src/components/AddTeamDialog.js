import React from 'react'

import { Dialog, Button, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'

const AddTeamDialog = ({ openTeamAddDialog, handleCloseAddTeam }) => {
  return (
    <div>
      <Dialog open={openTeamAddDialog}>
        <DialogTitle>Add team</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new team to system.</DialogContentText>
          <TextField autoFocus margin="dense" id="team" label="Team name" type="text" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTeam}>Cancel</Button>
          <Button onClick={handleCloseAddTeam}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddTeamDialog
