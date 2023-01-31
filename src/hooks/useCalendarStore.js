import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
export const useCalendarStore = () => {

    const {
        events,
        activeEvent
    } = useSelector(state => state.calendar);


    const {
        user
    } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {
        //TODO: Update Event

        try {
            //Todo bien
            if (calendarEvent.id) {
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);

                dispatch(onUpdateEvent({ ...calendarEvent, user }))
                return;
            } else {
                const { data } = await calendarApi.post('/events', calendarEvent)

                dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }))
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }


    }

    const startDeletingEvent = async () => {
        //Todo: Llegar al backend
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error)
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.events);
            dispatch(onLoadEvents(events))
        } catch (error) {
            console.log("Error cargando eventos")
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Eventos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents

    }
}