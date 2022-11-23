import * as React from 'react';
import { Calendar, Components, EventPropGetter, momentLocalizer, NavigateAction, ToolbarProps, } from "react-big-calendar";
import * as Moment from "moment";
require('moment/locale/da.js')
import 'moment-timezone';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { FluentCalendar } from './FluentCalendar';
import { addMonths, PrimaryButton, Stack, Text, getPersonaInitialsColor } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx, GraphFI, graphGet, GraphQueryable } from "@pnp/graph/presets/all";
import '@pnp/graph/calendars';
import '@pnp/graph/users';
import { MeetingRoomsDesc } from './MeetingRoomsDesc';
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../MeetingRoomBooking.module.scss';
import { IEvent } from '../../models/IEvent';
import { findRooms } from '@pnp/graph/calendars/funcs';
import { useCallback } from 'react';
import { Room } from '@microsoft/microsoft-graph-types';
import { IRoomEventsProvider, RoomEventsProvider } from '../../../../providers/RoomEventsProvider';
import { find } from '@microsoft/sp-lodash-subset';


export interface IMyCalendarProps {
    context: WebPartContext;
}

Moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(Moment)
let graph: GraphFI;
let calendarNavigate: (navigate: NavigateAction, date?: Date) => void = null;


export const MyCalendar: React.FunctionComponent<IMyCalendarProps> = (props: React.PropsWithChildren<IMyCalendarProps>) => {

    const [rooms, setRooms] = React.useState<IMeetingRoom[]>([]);
    const [roomEvents, setRoomEvents] = React.useState<IEvent[]>([]);

    React.useEffect(() => {

        const fetchData = async () => {
            graph = graphfi().using(SPFx(props.context));

            const roomInformation: microsoftgraph.Room[] = await graphGet(GraphQueryable(`https://graph.microsoft.com/v1.0/places/microsoft.graph.room`).using(SPFx(props.context)));
            let events: microsoftgraph.Event[][] = []; //få mappet den ind til noget relevant aka .
            let finalEvents: IEvent[] = [];
            let finalRooms: IMeetingRoom[] = [];

            for (let room of roomInformation) {
                let bookings = await getSpecificRoomEvents(room.emailAddress);
                events.push(bookings);

                for (let event of bookings) {//DTO dat trnsf obj / mapping
                    let newEvent: IEvent = {
                        locationId: room.id,
                        id: event.id,
                        title: event.location.displayName,
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
                    color: getBackgroundColor(room.id + room.displayName),
                }
                finalRooms.push(newRoom);
            }
            setRooms(finalRooms)
            setRoomEvents(finalEvents)
            return finalEvents;
        }

        fetchData();
    }, []);

    function getBackgroundColor(stringInput) {
        let stringUniqueHash = [...stringInput].reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
    }

    const getSpecificRoomEvents = async (email: string) => {
        const getRoomEvents: microsoftgraph.Event[] = await graphGet(GraphQueryable(`https://graph.microsoft.com/v1.0/users/${email}/calendar/events`).using(SPFx(props.context)));
        return getRoomEvents;
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
        console.log("Dan: " + getPersonaInitialsColor({ text: "Dan" }))
        console.log("Dan1: " + getPersonaInitialsColor({ text: "Dan1" }))
        console.log("Dan2: " + getPersonaInitialsColor({ text: "Dan2" }))

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

