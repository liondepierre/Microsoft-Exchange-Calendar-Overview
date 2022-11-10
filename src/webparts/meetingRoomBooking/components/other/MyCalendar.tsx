import * as React from 'react';
import { Calendar, Components, momentLocalizer, NavigateAction, ToolbarProps, } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import '../../../src/addons/dragAndDrop/styles.scss'
import * as moment from "moment";
require('moment/locale/da.js')
import 'moment-timezone';
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { IEvent } from '../../models/IEvent';
import MeetingRoomsDesc from './MeetingRoomsDesc';
import { FluentCalendar } from './FluentCalendar';

moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(moment)


const meetingRooms: IMeetingRoom[] = [
    {
        id: 1,
        color: "#2F87B3",
        roomName: "Stort mødelokale",
        capacity: 8,
        location: "Herning"
    },
    {
        id: 2,
        color: "#6C36D9",
        roomName: "Lille mødelokale",
        capacity: 4,
        location: "Herning"
    }
]


const events: IEvent[] = [
    {
        id: 1,
        title: "Store mødelokale",
        allDay: false,
        start: new Date(2022, 10, 7, 7, 30),
        end: new Date(2022, 10, 7, 8, 20),
        locationId: 1
    },
    {
        id: 2,
        title: "Lille mødelokale",
        start: new Date(2022, 10, 8, 8, 30),
        end: new Date(2022, 10, 8, 10, 0),
        desc: "det her er det lille mødelokale",
        locationId: 2
    },
    {
        id: 3,
        title: "Lille mødelokale",
        start: new Date(2022, 10, 9, 8, 30),
        end: new Date(2022, 10, 9, 11, 0),
        locationId: 1
    },
    {
        id: 4,
        title: "Mødelokale Vest",
        start: new Date(2022, 10, 10, 7, 40),
        end: new Date(2022, 10, 10, 13, 15),
        locationId: 2
    },
]


let calendarNavigate: (navigate: NavigateAction, date?: Date) => void = null;

const MyCalendar = () => {

    const [allEvents, setAllEvents] = React.useState<IEvent[]>(events);

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>

            <Stack style={{ marginTop: "81px", paddingLeft: "50px", gap: "20px" }} className='roomDesc'>

                <FluentCalendar
                    onPrev={() => calendarNavigate("PREV")} onNext={() => calendarNavigate("NEXT")}
                    onChangeDate={(date) => calendarNavigate("DATE", date)} onToday={() => calendarNavigate("TODAY")} />
                <Text variant='xxLarge'>Mødelokaler</Text>
                {meetingRooms.map((room) => {
                    return (
                        <div>
                            <MeetingRoomsDesc color={room.color} roomName={room.roomName} capacity={room.capacity} location={room.location} />
                        </div>
                    )
                })}
            </Stack>


            <Stack style={{ width: "100%" }} className='calendar' horizontal>
                <Calendar
                    components={toolBarButtonActions()}
                    defaultView='week'
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", width: "100%", margin: "50px" }}
                    eventPropGetter={(event) => {
                        const room = meetingRooms.filter((room) => room.id === event["locationId"])[0];
                        const backgroundColor = room ? room.color : "";
                        return { style: { backgroundColor: backgroundColor } }
                    }}
                />
            </Stack>
        </div>
    )
}


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


export default MyCalendar