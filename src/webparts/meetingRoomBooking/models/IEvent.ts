
export interface IEvent {
    id?: string;
    title: string;
    allDay?: boolean
    start: Date;
    end: Date;
    locationId?: string;
  }