import * as React from 'react';
import { Calendar, Components, EventPropGetter, momentLocalizer, NavigateAction, SlotInfo, ToolbarProps, } from "react-big-calendar";
import * as Moment from "moment";
require('moment/locale/da.js')
import 'moment-timezone';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { FluentCalendar } from './FluentCalendar';
import { addMonths, PrimaryButton, Stack, Text, getPersonaInitialsColor, Panel } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx, GraphFI, graphGet, GraphQueryable } from "@pnp/graph/presets/all";
import '@pnp/graph/calendars';
import '@pnp/graph/users';
import { MeetingRoomsDesc } from './MeetingRoomsDesc';
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../MeetingRoomBooking.module.scss';
import { IEvent } from '../../models/IEvent';
import { IGraphCalendarProvider, GraphCalendarProvider } from '../../../../providers/GraphCalendarProvider';


export interface IMyCalendarProps {
    context: WebPartContext;
}

Moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(Moment)
let calendarNavigate: (navigate: NavigateAction, date?: Date) => void = null;


export const MyCalendar: React.FunctionComponent<IMyCalendarProps> = (props: React.PropsWithChildren<IMyCalendarProps>) => {

    const graphCalendarProvider: IGraphCalendarProvider = new GraphCalendarProvider(props.context)

    const [rooms, setRooms] = React.useState<IMeetingRoom[]>([]);
    const [roomEvents, setRoomEvents] = React.useState<IEvent[]>([]);

    React.useEffect(() => {

        const fetchData = async () => {

            const roomInformation: microsoftgraph.Room[] = await graphCalendarProvider.getRoomInformation();
            let events: microsoftgraph.Event[][] = []; //få mappet den ind til noget relevant aka .
            let finalRooms: IMeetingRoom[] = [];
            let finalEvents: IEvent[] = [];

            for (let room of roomInformation) {
                let bookings: microsoftgraph.Event[] = await graphCalendarProvider.getSpecificRoomEvents(room.emailAddress)
                events.push(bookings);

                for (let event of bookings) {//DTO dat trnsf obj / mapping
                    let newEvent: IEvent = {
                        locationId: room.id,
                        id: event.id,
                        title: `${event.subject}`,
                        allDay: false,
                        start: new Date(event.start.dateTime + "z"),
                        end: new Date(event.end.dateTime + "z"),
                    }
                    finalEvents.push(newEvent);
                }
                let newRoom: IMeetingRoom = {
                    id: room.id,
                    roomName: room.displayName,
                    capacity: room.capacity,
                    location: room.address.city,
                    color: getPersonaInitialsColor({text: room.emailAddress + room.emailAddress}),
                }
                
                finalRooms.push(newRoom);
            }

            setRooms(finalRooms)
            setRoomEvents(finalEvents)
            return finalEvents;
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

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Stack style={{ marginTop: "81px", paddingLeft: "50px", gap: "20px" }} className='roomDesc'>
                <FluentCalendar
                    onPrev={() => calendarNavigate("PREV")} onNext={() => calendarNavigate("NEXT")}
                    onChangeDate={(date) => calendarNavigate("DATE", date)} onToday={() => calendarNavigate("TODAY")} />
                <Text variant='xxLarge'>Mødelokaler</Text>
                {rooms.map((roomInfo: IMeetingRoom) => {
                    return (
                        <div>
                            <MeetingRoomsDesc color={roomInfo.color} roomName={roomInfo.roomName} capacity={roomInfo.capacity} location={roomInfo.location} />
                        </div>
                    )
                })}
            </Stack>
            <Stack style={{ width: "100%" }} className='calendar' horizontal>
                <Calendar
                    components={toolBarButtonActions()}
                    defaultView='week'
                    localizer={localizer}
                    events={roomEvents}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectEvent={(event: IEvent) => {
                        window.alert(event.title)
                    }}
                    onSelectSlot={(slotInfo: SlotInfo) => {
                       slotInfo.action
                    }}
                    style={{ height: "100%", width: "100%", margin: "55px" }}
                    eventPropGetter={(event) => {
                        const meetingRoom = rooms.filter((room) => room.id === event.locationId)[0];
                        const backgroundColor = meetingRoom ? meetingRoom.color : "";
                        return { style: { backgroundColor: backgroundColor } }
                    }}
                />
            </Stack>
        </div>
    )
}

