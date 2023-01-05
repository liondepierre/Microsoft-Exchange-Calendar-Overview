import { Stack } from 'office-ui-fabric-react';
import * as React from 'react';

export interface IMeetingRoomsDescProps {
    color: string;
    textColor?: string;
    opacity: number;
    roomName: string;
    capacity: number;
    location: string
    displayDeviceName: string;
    videoDeviceName: string;
}

export const MeetingRoomsDesc: React.FunctionComponent<IMeetingRoomsDescProps> = (props: React.PropsWithChildren<IMeetingRoomsDescProps>) => {
    return (
        <Stack horizontal>
         <div style={{ marginRight: "3px", marginTop: "3px", backgroundColor: props.color, width: "15px", height: "15px", opacity: props.opacity }} />
            <div style={{ fontFamily: "Segoe UI", fontWeight: "bold", fontSize: "15px", opacity: props.opacity, color: props.textColor }}> 
            {props.roomName} {props.capacity} personer, {props.location} | {props.displayDeviceName} - {props.videoDeviceName}
            </div>
        </Stack>
    );
};

