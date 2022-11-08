
export interface IEvent {
    id?: number;
    title: string;
    allDay?: boolean
    start: Date;
    end: Date;
    desc?: string;
    locationId: number;
  }