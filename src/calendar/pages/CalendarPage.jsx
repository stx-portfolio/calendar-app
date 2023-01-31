
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US'
import { addHours } from 'date-fns/esm'
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from "../"
import { getMessagesES, localizer } from '../../helpers'
import { useEffect, useState } from 'react';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';



export const CalendarPage = () => {
  const { user } = useAuthStore()
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') ?? 'month');
  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log({ event, start, end, isSelected })
    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
    const style = {
      backgroundColor: isMyEvent? '#34C7F7':'#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    // console.log({ doubleClick: event });
    openDateModal()
  }


  const onSelect = (event) => {
    console.log({ click: event })
  }


  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
  }


  useEffect(() => {
    startLoadingEvents();
  }, [])

  return (
    <>
      <NavBar />

      <Calendar
        localizer={localizer}
        culture="es"
        defaultView={lastView}
        messages={getMessagesES()}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={setActiveEvent}
        onView={onViewChanged}
      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}
