import * as React from 'react';
import { NavigateAction, ToolbarProps } from 'react-big-calendar';
import { FluentCalendar } from './FluentCalendar';
import styles from '../MeetingRoomBooking.module.scss';
import { MeetingRoomsDesc } from './MeetingRoomsDesc';
import { RoomsContext } from '../../contexts/RoomsContext';
import { IMeetingRoom } from '../../models/IMeetingRoom';
import { IEvent } from '../../models/IEvent';
import { ISearchQuery } from '../../models/ISearchQuery';
import { Stack, Icon, Text } from 'office-ui-fabric-react';
import { ISearchOptions } from '../../models/ISearchOptions';
import { FilteredRoomOptions } from '../../filterLogik/FilteredRoomOptions';
import { FilterOptions } from './FilterOptions';

export interface IRoomsInfoProps {
    rooms: IMeetingRoom[];
    setRooms: Function;
    roomEvents: IEvent[],
    setRoomEvents: Function,
    calendarNavigate: (navigate: NavigateAction, date?: Date) => void;
    onFilterRoomEvents?: (searchQuery: ISearchQuery) => IEvent[];
    searchQuery: ISearchQuery;
    setSearchQuery: Function;
    roomsToShow?: IEvent[];
}

export const RoomsInfo: React.FunctionComponent<IRoomsInfoProps> = (props: React.PropsWithChildren<IRoomsInfoProps>) => {

    let roomsContext = React.useContext(RoomsContext);

    const [calloutIsVisible, setCalloutIsVisible] = React.useState<boolean>(false);
    // const [searchQuery, setSearchQuery] = React.useState<ISearchQuery>({ eventCapacity: 0, location: "", hasDisplayDevice: "", hasVideoDevice: "" });
    const [searchOptions, setSearchOptions] = React.useState<ISearchOptions>({ maxRoomCapacity: 0, locations: [""], videoDevices: [""], displayDevices: [""] });

    React.useEffect(() => {
        loadSearchOptions();

    }, props.rooms);

    const loadSearchOptions = (): ISearchOptions => {
        let filteredOptionValues = new FilteredRoomOptions().filteredOptions(props.rooms);
        setSearchOptions(filteredOptionValues);

        return filteredOptionValues;
    }



    const onGenerateEmptySearchQuery = (): void => {
        props.setSearchQuery({ eventCapacity: 0, location: "", hasDisplayDevice: "", hasVideoDevice: "" })
        setCalloutIsVisible(false)
    }

    const updateSearchQuery = (updates: Partial<ISearchQuery>) => {
        props.setSearchQuery({ ...props.searchQuery, ...updates });
    }

    const onCheckSearchQueryEmpty = (): boolean => {
        if (props.searchQuery.eventCapacity !== 0) {
            return false;
        }
        if (props.searchQuery.location !== "") {
            return false;
        }
        if (props.searchQuery.hasDisplayDevice !== "") {
            return false;
        }
        if (props.searchQuery.hasVideoDevice !== "") {
            return false;
        } 
        else {
            return true;
        }
    }


    return (
        <Stack className={styles.roomDesc}>
            <FluentCalendar
                onPrev={() => props.calendarNavigate("PREV")}
                onNext={() => props.calendarNavigate("NEXT")}
                onChangeDate={(date) => props.calendarNavigate("DATE", date)}
                onToday={() => props.calendarNavigate("TODAY")}
            />
            <Stack tokens={{ childrenGap: "15px" }} horizontal>
                <Text variant='xxLarge'>Mødelokaler</Text>
                <Icon id='filterBtn' iconName='Filter' onClick={() => { setCalloutIsVisible(true); loadSearchOptions() }} />
                <div hidden={onCheckSearchQueryEmpty()}>
                    <Icon id='clearFilterBtn' iconName='ClearFilter' 
                    onClick={() => { onGenerateEmptySearchQuery(); setCalloutIsVisible(false) }} />
                </div>
            </Stack>
            <>
                {props.rooms.sort((a, b) => b.capacity - a.capacity).map((x) => {
                    let textOpacity: number;
                    if (props.searchQuery.eventCapacity >= (x.capacity + 1)) {
                        textOpacity = 0.3;
                    }
                    if (props.searchQuery.location !== x.location
                        && props.searchQuery.location !== "") {
                        textOpacity = 0.3;
                    }
                    if (props.searchQuery.hasDisplayDevice !== x.displayDeviceName
                        && props.searchQuery.hasDisplayDevice !== "") {
                        textOpacity = 0.3;
                    }
                    if (props.searchQuery.hasVideoDevice !== x.videoDeviceName
                        && props.searchQuery.hasVideoDevice !== "") {
                        textOpacity = 0.3;
                    }  
                    // if (props.roomsToShow.length === 0) {
                    //     return <div></div>
                    // }

                    return (
                        <>
                            <MeetingRoomsDesc
                                color={x.color}
                                opacity={textOpacity}
                                roomName={x.roomName}
                                capacity={x.capacity}
                                location={x.location}
                                displayDeviceName={x.displayDeviceName}
                                videoDeviceName={x.videoDeviceName}
                            />
                        </>
                    )
                })}
            </>

            <FilterOptions
                calloutIsVisible={calloutIsVisible}
                setCalloutIsVisible={setCalloutIsVisible}
                searchOptions={searchOptions}
                setSearchOptions={setSearchOptions}
                searchQuery={props.searchQuery}
                setSearchQuery={props.setSearchQuery}
                onCheckSearchQueryEmpty={onCheckSearchQueryEmpty}
                onGenerateEmptySearchQuery={onGenerateEmptySearchQuery}
                updateSearchQuery={updateSearchQuery}
            />
        </Stack>
    );
};

