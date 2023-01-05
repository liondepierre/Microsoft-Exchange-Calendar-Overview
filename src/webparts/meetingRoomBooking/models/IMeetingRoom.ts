export interface IMeetingRoom {
    id: string;
    roomName: string;
    capacity: number;
    location: string;
    color?: string;
    email: string;
    videoDeviceName?: string;
    displayDeviceName?: string;
}
