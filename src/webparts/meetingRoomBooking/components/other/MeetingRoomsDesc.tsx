import * as React from 'react';

export interface IMeetingRoomsDescProps {
    color: string;
    roomName: string;
    capacity: number;
    location: string
}

export const MeetingRoomsDesc: React.FunctionComponent<IMeetingRoomsDescProps> = (props: React.PropsWithChildren<IMeetingRoomsDescProps>) => {
    return (
        <>
            <div style={{ marginTop: "3px", backgroundColor: props.color, width: "15px", height: "15px" }} />
            <div style={{ fontFamily: "Segoe UI", fontWeight: "bold", fontSize: "15px" }}>{props.roomName}, {props.capacity} personer, {props.location}</div>
        </>
    );
};

