import React, { useEffect, useState } from 'react'
import Timeline, { TimelineHeaders, DateHeader, TimelineMarkers, TodayMarker } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import axios from 'axios'

const envMode = process.env.NODE_ENV
const apiBaseUrl = envMode === 'development' ? 'http://localhost:5000/api' : '/api'

const defaultTimeStart = moment().startOf('day').add(-20, 'day').toDate()
const defaultTimeEnd = moment().startOf('day').add(40, 'day').toDate()

// National holidays
// These are here manually because of less querys to azure db, cheaper... :D
const format = 'DD.MM.YYYY'
const holidays = [
  moment('06.12.2021', format),
  moment('25.12.2021', format),
  moment('26.12.2021', format),
  moment('01.01.2022', format),
  moment('06.01.2022', format),
  moment('15.04.2022', format),
  moment('17.04.2022', format),
  moment('18.04.2022', format),
  moment('01.05.2022', format),
  moment('26.05.2022', format),
  moment('05.06.2022', format),
  moment('25.06.2022', format),
  moment('05.11.2022', format),
  moment('06.12.2022', format),
  moment('25.12.2022', format),
  moment('26.12.2022', format),
  moment('01.01.2023', format),
  moment('06.01.2023', format),
  moment('07.04.2023', format),
  moment('09.04.2023', format),
  moment('10.04.2023', format),
  moment('01.05.2023', format),
  moment('18.05.2023', format),
  moment('28.05.2023', format),
  moment('24.06.2023', format),
  moment('04.11.2023', format),
  moment('06.12.2023', format),
  moment('25.12.2023', format),
  moment('26.12.2023', format),
]

// For intitilization, not working without
const initItems = [
  {
    id: 1,
    group: 1,
    title: '-',
    start_time: moment(),
    end_time: moment().add(1, 'day'),
  },
]

// For parsing epoch time to suitable yyyyMMddThhmm format
const parseDate = (epochTime) => {
  const newTimeObject = new Date(epochTime)
  const newTimeYear = newTimeObject.toLocaleString('fi-FI', { year: 'numeric' })
  const newTimeMonth = newTimeObject.toLocaleString('fi-FI', { month: '2-digit' })
  const newTimeDay = newTimeObject.toLocaleString('fi-FI', { day: '2-digit' })
  const newTimeHour = newTimeObject.toLocaleString('fi-FI', { hour: '2-digit' })
  const newTimeMinute =
    newTimeObject.toLocaleString('fi-FI', { minute: '2-digit' }) === '0' ? '00' : newTimeObject.toLocaleString('fi-FI', { minute: '2-digit' })
  const parsedTime = newTimeYear + newTimeMonth + newTimeDay + 'T' + newTimeHour + newTimeMinute
  return parsedTime
}

const TimelineComponent = ({ users, filteredUsers }) => {
  const [itemData, setItemData] = useState(initItems)

  useEffect(() => {
    axios.get(`${apiBaseUrl}/items`).then((res) => {
      const items = res.data.map((item) => {
        return { ...item, start_time: moment(item.start_time), end_time: moment(item.end_time) }
      })
      setItemData(items)
    })
  }, [])

  // For marking holidays etc
  const verticalLineClassNamesForTime = (timeStart, timeEnd) => {
    const currentTimeStart = moment(timeStart)
    const currentTimeEnd = moment(timeEnd)

    let classes = []

    // check for public holidays
    for (let holiday of holidays) {
      if (holiday.isSame(currentTimeStart, 'day') && holiday.isSame(currentTimeEnd, 'day')) {
        classes.push('holiday')
      }
    }

    return classes
  }

  const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
    const items = itemData
    const groups = users
    const group = groups[newGroupOrder]

    const newItems = items.map((item) => {
      return item.id === itemId
        ? Object.assign({}, item, {
            start_time: dragTime,
            end_time: dragTime + (item.end_time - item.start_time),
            group: group.id,
          })
        : item
    })

    const itemToBeModified = items.filter((item) => item.id === itemId)

    // NEW STARTTIME PARSING
    const newStartTimeToDb = parseDate(dragTime)

    // NEW ENDTIME PARSING
    const newEndTimeToDb = parseDate(dragTime + (itemToBeModified[0].end_time - itemToBeModified[0].start_time))

    const modifiedItem = {
      group: itemToBeModified[0].group,
      title: itemToBeModified[0].title,
      start_time: newStartTimeToDb,
      end_time: newEndTimeToDb,
    }

    const idOfModifiedItem = itemToBeModified[0].id

    try {
      const res = await axios.put(`${apiBaseUrl}/items/${idOfModifiedItem}`, modifiedItem)
      // console.log(res.data)
      if (res.data.message === 'Bad Request. Missing information.') {
        alert('Something went wrong, needs incestigation')
      } else {
        // console.log('Update ok')
        setItemData(newItems)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleItemDelete = async (itemId, _e, _time) => {
    const items = itemData

    if (window.confirm('Really want to delete item?')) {
      const res = await axios.delete(`${apiBaseUrl}/items/${itemId}`)

      if (res.data.deleted === 1) {
        const newItems = items.filter((item) => item.id !== itemId)
        setItemData(newItems)
      } else {
        console.log('Something went wrong in delete, needs investigations')
        return
      }
    }
  }

  const handleItemResize = async (itemId, time, edge) => {
    const items = itemData

    const newItems = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start_time: edge === 'left' ? time : item.start_time,
            end_time: edge === 'left' ? item.end_time : time,
          })
        : item
    )

    const itemToBeModified = newItems.filter((item) => item.id === itemId)

    // NEW STARTTIME PARSING
    const newStartTimeToDb = parseDate(itemToBeModified[0].start_time)

    // NEW ENDTIME PARSING
    const newEndTimeToDb = parseDate(itemToBeModified[0].end_time)

    const modifiedItem = {
      group: itemToBeModified[0].group,
      title: itemToBeModified[0].title,
      start_time: newStartTimeToDb,
      end_time: newEndTimeToDb,
    }

    const idOfModifiedItem = itemToBeModified[0].id

    try {
      const res = await axios.put(`${apiBaseUrl}/items/${idOfModifiedItem}`, modifiedItem)
      // console.log(res.data)
      if (res.data.message === 'Bad Request. Missing information.') {
        alert('Something went wrong, needs incestigation')
      } else {
        // console.log('Update ok')
        setItemData(newItems)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Timeline
        groups={filteredUsers}
        items={itemData}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDoubleClick={handleItemDelete}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        canMove={true}
        canChangeGroup={false}
        canResize={'both'}
        lineHeight={50}
        itemHeightRatio={0.7}
        stackItems={false}
        timeSteps={{ second: 0, minute: 0, hour: 1, day: 1, month: 1, year: 1 }}
        verticalLineClassNamesForTime={verticalLineClassNamesForTime}
      >
        <TimelineHeaders className="mainheader">
          <DateHeader className="dateheader" height={50} unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
        <TimelineMarkers>
          <TodayMarker>{({ styles, _date }) => <div style={{ ...styles, backgroundColor: 'red', width: '5px' }} />}</TodayMarker>
        </TimelineMarkers>
      </Timeline>
    </div>
  )
}

export default TimelineComponent
