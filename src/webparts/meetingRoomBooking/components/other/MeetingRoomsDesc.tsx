import { Stack, Text } from 'office-ui-fabric-react'
import * as React from 'react'

export interface IMeetingRoomDescProps {
    color: string;
    roomName: string;
    capacity: number;
    location: string
}

const MeetingRoomsDesc = ({ color, roomName, capacity, location }: IMeetingRoomDescProps) => {
    return (
        <Stack tokens={{ childrenGap: "5px" }} horizontal>
            <Stack style={{ marginTop: "3px", backgroundColor: color, width: "15px", height: "15px" }} />
            <div style={{fontFamily: "Segoe UI", fontWeight: "bold", fontSize: "15px"}}>{roomName}, {capacity} personer, {location}</div>
        </Stack>

    )
}

export default MeetingRoomsDesc