import * as React from 'react';
import { Calendar, Components, EventPropGetter, momentLocalizer, NavigateAction, SlotInfo, ToolbarProps, } from "react-big-calendar";
import * as Moment from "moment";
require('moment/locale/da.js')
import 'moment-timezone';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/graph/calendars';
import '@pnp/graph/users';
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from '../MeetingRoomBooking.module.scss';
import { IEvent } from '../../models/IEvent';
import { IGraphCalendarProvider, GraphCalendarProvider } from '../../../../providers/GraphCalendarProvider';
import { RoomsContext } from '../../contexts/RoomsContext';
import { RoomsInfo } from './RoomsInfo';
import { Stack } from 'office-ui-fabric-react';
import { ISearchQuery } from '../../models/ISearchQuery';
import { ISearch } from '@pnp/graph/search';
import { ISearchOptions } from '../../models/ISearchOptions';

export interface IMyCalendarProps {
    context: WebPartContext;
}

Moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(Moment)
let calendarNavigate: (navigate: NavigateAction, date?: Date) => void = null;


export const MyCalendar: React.FunctionComponent<IMyCalendarProps> = (props: React.PropsWithChildren<IMyCalendarProps>) => {

    const graphCalendarProvider: IGraphCalendarProvider = new GraphCalendarProvider(props.context)
    const today: Date = new Date();

    const [rooms, setRooms] = React.useState<IMeetingRoom[]>([]);
    const [roomEvents, setRoomEvents] = React.useState<IEvent[]>([]);
    const [searchQuery, setSearchQuery] = React.useState<ISearchQuery>({ eventCapacity: 0, location: "", hasDisplayDevice: "", hasVideoDevice: "" });

    React.useEffect(() => {

        const fetchData = async () => {
            const rooms: IMeetingRoom[] = await graphCalendarProvider.getRooms();
            setRooms(rooms);

            const eventRooms: IEvent[] = await graphCalendarProvider.getBookingsForRooms(rooms)
            setRoomEvents(eventRooms)
        }
        fetchData();
    }, []);

    const toolBarButtonActions = () => {
        return {
            toolbar: (e: ToolbarProps) => {
                calendarNavigate = e.onNavigate;
                return (
                    <div>
                    </div>
                );
            }
        }
    }

    const onFilterRoomEvents = (searchQuery: ISearchQuery): IEvent[] => {
        let allEvents: IEvent[] = roomEvents;

        if (searchQuery.eventCapacity !== 0) {
            allEvents = allEvents
                .filter(event => rooms
                    .find(room => room.id === event.locationId 
                        && room.capacity >= searchQuery.eventCapacity));
        }
        if (searchQuery.location !== "") {
            allEvents = allEvents
                .filter(event => rooms
                    .find(room => room.id === event.locationId 
                        && room.location === searchQuery.location));
        }
        if (searchQuery.hasDisplayDevice !== "") {
            allEvents = allEvents
                .filter(event => rooms
                    .find(room => room.id === event.locationId 
                        && room.displayDeviceName === searchQuery.hasDisplayDevice));
        }
        if (searchQuery.hasVideoDevice !== "") {
            allEvents = allEvents
                .filter(event => rooms
                    .find(room => room.id === event.locationId 
                        && room.videoDeviceName === searchQuery.hasVideoDevice));
        }

        return allEvents;
    }

    const roomsToShow = onFilterRoomEvents(searchQuery)

    return (
        <RoomsContext.Provider value={{}}>
            <div className={styles.myCalendarParent}>
                <RoomsInfo
                    rooms={rooms}
                    setRooms={setRooms}
                    roomEvents={roomEvents}
                    // roomsToShow={roomsToShow}
                    searchQuery={searchQuery}
                    setRoomEvents={setRoomEvents}
                    setSearchQuery={setSearchQuery}
                    calendarNavigate={calendarNavigate}
                    onFilterRoomEvents={onFilterRoomEvents}
                />
                <Stack className={styles.reactBigCalendarParent} horizontal>
                    <Calendar
                        min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)}
                        max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)}
                        className={styles.reactBigCalendar}
                        components={toolBarButtonActions()}
                        defaultView='week'
                        localizer={localizer}
                        events={roomsToShow}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        onSelectEvent={(event: IEvent) => {
                            window.alert(event.title)
                        }}
                        onSelectSlot={(slotInfo: SlotInfo) => {
                            slotInfo.action
                        }}
                        eventPropGetter={(event) => {
                            const meetingRoom = rooms.filter((room) => room.id === event.locationId)[0];
                            const backgroundColor = meetingRoom ? meetingRoom.color : "";
                            return { style: { backgroundColor: backgroundColor } }
                        }}
                    />
                </Stack>
            </div>
        </RoomsContext.Provider>
    )
}


