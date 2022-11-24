import { WebPartContext } from "@microsoft/sp-webpart-base";
import { graphfi, SPFx, GraphFI, graphGet, GraphQueryable } from "@pnp/graph/presets/all";
import { getPersonaInitialsColor } from "office-ui-fabric-react";
import { IEvent } from "../webparts/meetingRoomBooking/models/IEvent";
import { IMeetingRoom } from "../webparts/meetingRoomBooking/models/IMeetingRoom";

export interface IGraphCalendarProvider {
    getSpecificRoomEvents(email: string): Promise<microsoftgraph.Event[]>
    getRoomInformation(): Promise<microsoftgraph.Room[]>;
    
    
    getRooms(): Promise<IMeetingRoom[]>;
    getBookingsForRooms(Rooms: IMeetingRoom[]): Promise<IEvent>[];
}


export class GraphCalendarProvider implements IGraphCalendarProvider {
    private context: WebPartContext;
    constructor(context: WebPartContext) {
      this.context = context;
    }
   
    async getRooms(): Promise<IMeetingRoom[]> {
        throw new Error("Method not implemented.");
    }

    getBookingsForRooms(Rooms: IMeetingRoom[]): Promise<IEvent>[] {
        throw new Error("Method not implemented.");
    }
    

    public async getSpecificRoomEvents(email: string): Promise<microsoftgraph.Event[]> {
        const bookings: microsoftgraph.Event[] = await graphGet(GraphQueryable(`https://graph.microsoft.com/v1.0/users/${email}/calendar/events`).using(SPFx(this.context)));
        
        return bookings;
    }

    async getRoomInformation(): Promise<microsoftgraph.Room[]> {
        const roomInformation: microsoftgraph.Room[] = await graphGet(GraphQueryable(`https://graph.microsoft.com/v1.0/places/microsoft.graph.room`).using(SPFx(this.context)));
        return roomInformation;
    }

}