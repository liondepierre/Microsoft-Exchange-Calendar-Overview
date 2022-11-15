import * as React from 'react';
import { Calendar, Components, momentLocalizer, NavigateAction, ToolbarProps, } from "react-big-calendar";
import * as Moment from "moment";
require('moment/locale/da.js')
import 'moment-timezone';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { FluentCalendar } from './FluentCalendar';
import { addMonths, PrimaryButton, Stack, Text } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx, GraphFI } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';
import { MeetingRoomsDesc } from './MeetingRoomsDesc';
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../MeetingRoomBooking.module.scss';


export interface IMyCalendarProps {
    context: WebPartContext;
}



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



// const events: IEvent[] = [
//     {
//         id: 1,
//         title: "Store mødelokale",
//         allDay: false,
//         start: new Date(2022, 10, 11, 7, 30),
//         end: new Date(2022, 10, 11, 8, 20),
//         locationId: 1
//     },
//     {
//         id: 2,
//         title: "Lille mødelokale",
//         allDay: false,
//         start: new Date(2022, 10, 12, 9, 30),
//         end: new Date(2022, 10, 12, 20, 50),
//         locationId: 1
//     },
// ]



Moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(Moment)
let graph: GraphFI;
let calendarNavigate: (navigate: NavigateAction, date?: Date) => void = null;


export const MyCalendar: React.FunctionComponent<IMyCalendarProps> = (props: React.PropsWithChildren<IMyCalendarProps>) => {

    // const [allEvents, setAllEvents] = React.useState<IEvent[]>(events);
    const [calendarEvent, setCalendarEvent] = React.useState<microsoftgraph.Event[]>([])
    const [places, setPlaces] = React.useState([])

    React.useEffect(() => {
        graph = graphfi().using(SPFx(props.context));
        getSpecificCalendar();
    }, []);

    const getSpecificCalendar = async () => {
        await graph.me.events().then((e) => setCalendarEvent(e));
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

    const data = calendarEvent.map((event: microsoftgraph.Event) => {
        return {
            id: event.id,
            title: event.location.displayName,
            allDay: false,
            start: new Date(event.start.dateTime + "z"), 
            end: new Date(event.end.dateTime + "z"),
        }
    });


    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <h1 className='text'>fewjfewjfij</h1>
            <Stack style={{ marginTop: "81px", paddingLeft: "50px", gap: "20px" }} className='roomDesc'>
                <FluentCalendar
                    onPrev={() => calendarNavigate("PREV")} onNext={() => calendarNavigate("NEXT")}
                    onChangeDate={(date) => calendarNavigate("DATE", date)} onToday={() => calendarNavigate("TODAY")} />
                <Text variant='xxLarge'>Mødelokaler</Text>
                {calendarEvent.map((room) => {
                    return (
                        <div>
                            <MeetingRoomsDesc color={"#2F87B3"} roomName={room.location.displayName} capacity={null} location={room.location.address.city} />
                        </div>
                    )
                })}
            </Stack>
            <Stack style={{ width: "100%" }} className='calendar' horizontal>
                <Calendar
                    components={toolBarButtonActions()}
                    defaultView='week'
                    localizer={localizer}
                    events={data}
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


