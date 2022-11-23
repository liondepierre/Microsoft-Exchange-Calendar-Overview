import { WebPartContext } from "@microsoft/sp-webpart-base";
import { graphGet, GraphQueryable } from "@pnp/graph";
import { IEvent } from "@pnp/graph/calendars";
import { spfi, SPFI, SPFx } from "@pnp/sp";

export interface IRoomEventsProvider {
    getRoomEvents(): Promise<microsoftgraph.Event[]>
}


export class RoomEventsProvider {
    private context: WebPartContext;


    constructor(context: WebPartContext){
        this.context = context;
    }


    // public async getSpecificRoomEvents(email: string): Promise<microsoftgraph.Event[]> {
    //     const getRoomEvents: microsoftgraph.Event[] = await graphGet(GraphQueryable(`https://graph.microsoft.com/v1.0/users/${email}/calendar/events`).using(SPFx(this.context)));
    //     return getRoomEvents;
    // }

}