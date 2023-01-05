import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFx, graphGet, GraphQueryable } from "@pnp/graph/presets/all";
import { getPersonaInitialsColor } from "office-ui-fabric-react";
import { IEvent } from "../webparts/meetingRoomBooking/models/IEvent";
import { IMeetingRoom } from "../webparts/meetingRoomBooking/models/IMeetingRoom";

export interface IGraphCalendarProvider {   
    getRooms(): Promise<IMeetingRoom[]>;
    getBookingsForRooms(rooms: IMeetingRoom[]): Promise<IEvent[]>;
}


export class GraphCalendarProvider implements IGraphCalendarProvider {
    private context: WebPartContext;
    constructor(context: WebPartContext) {
      this.context = context;
    }
    
    public async getRooms(): Promise<IMeetingRoom[]> {
        const results: microsoftgraph.Room[] = await this.getRoomInformation();
        let rooms: IMeetingRoom[] = []
        for (let room of results) {
            let newRoom: IMeetingRoom = {
                id: room.id,
                roomName: room.displayName,
                capacity: room.capacity,
                location: room.address.city,
                color: getPersonaInitialsColor({text: room.emailAddress + room.emailAddress}),
                email: room.emailAddress,
                videoDeviceName: room.videoDeviceName,
                displayDeviceName: room.displayDeviceName,
            }
            rooms.push(newRoom)
        }

        return rooms;
    }

    public async getBookingsForRooms(rooms: IMeetingRoom[]): Promise<IEvent[]> {
        let events: IEvent[] = [];
        for (let room of rooms) {
            let eventsResults = this.getSpecificRoomEvents(room.email);
            for (let event of await eventsResults) {
                let newEvent: IEvent = {
                    locationId: room.id,
                    id: event.id,
                    title: `${event.subject}`,
                    allDay: false,
                    start: new Date(event.start.dateTime + "z"),
                    end: new Date(event.end.dateTime + "z"),
                }
                events.push(newEvent);
            }
        }
        return events
    }


    private async getSpecificRoomEvents(email: string): Promise<microsoftgraph.Event[]> {
        const bookings: microsoftgraph.Event[] = await graphGet(
            GraphQueryable(`https://graph.microsoft.com/v1.0/users/${email}/calendar/events`)
            .using(SPFx(this.context))
            );
        return bookings;
    }

    private async getRoomInformation(): Promise<microsoftgraph.Room[]> {
        const roomInformation: microsoftgraph.Room[] = await graphGet(
            GraphQueryable(`https://graph.microsoft.com/v1.0/places/microsoft.graph.room`)
            .using(SPFx(this.context)));
        return roomInformation;
    }

}