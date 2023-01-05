import { IMeetingRoom } from "../models/IMeetingRoom";
import { ISearchOptions } from "../models/ISearchOptions";


export interface IFilterRoomOptions {
    filteredOptions(rooms: IMeetingRoom[]): ISearchOptions;
}

export class FilteredRoomOptions implements IFilterRoomOptions {

    public filteredOptions(rooms: IMeetingRoom[]): ISearchOptions {

        let searchOptions: ISearchOptions = {
            maxRoomCapacity: this.getMaxRoomCapacity(rooms),
            locations: this.locationOptions(rooms),
            displayDevices: this.displayDeviceOptions(rooms),
            videoDevices: this.videoDeviceOptions(rooms)
        };
        return searchOptions;
    }


    private getMaxRoomCapacity(rooms: IMeetingRoom[]): number {
        if (rooms.length === 0) return null;

        return Math.max(...rooms.map(x => x.capacity));
    }

    private locationOptions(rooms: IMeetingRoom[]): string[] {
        const roomLocationFiltered: string[] = rooms.map(x => x.location).filter((roomInfo, i, arr) => arr.indexOf(roomInfo) == i && roomInfo !== null);
        return roomLocationFiltered;
    }

    private displayDeviceOptions(rooms: IMeetingRoom[]): string[] {
        const roomDisplayDeviceFiltered: string[] = rooms.map(x => x.displayDeviceName).filter((roomInfo, i, arr) => arr.indexOf(roomInfo) == i && roomInfo !== null);
        return roomDisplayDeviceFiltered;
    }

    private videoDeviceOptions(rooms: IMeetingRoom[]): string[] {
        const roomVideoDeviceFiltered: string[] = rooms.map(x => x.videoDeviceName).filter((roomInfo, i, arr) => arr.indexOf(roomInfo) == i && roomInfo !== null);
        return roomVideoDeviceFiltered;
    }
}




