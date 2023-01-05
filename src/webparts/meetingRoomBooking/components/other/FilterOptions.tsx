import { FocusTrapCallout, Stack, Label, Slider, Icon, Dropdown, CompoundButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ISearchOptions } from '../../models/ISearchOptions';
import { ISearchQuery } from '../../models/ISearchQuery';
import styles from '../MeetingRoomBooking.module.scss';

export interface IFilterOptionsProps {
    searchOptions: ISearchOptions
    setSearchOptions: Function;
    calloutIsVisible: boolean;
    setCalloutIsVisible: Function;
    searchQuery: ISearchQuery;
    setSearchQuery: Function;
    updateSearchQuery: (updates: Partial<ISearchQuery>) => void;
    onCheckSearchQueryEmpty: () => boolean;
    onGenerateEmptySearchQuery: () => void;
}


export const FilterOptions: React.FunctionComponent<IFilterOptionsProps> = (props: React.PropsWithChildren<IFilterOptionsProps>) => {

    return (
        <FocusTrapCallout
            coverTarget
            setInitialFocus
            hidden={props.calloutIsVisible == false}
            style={{ margin: "28px" }}
            target={"#filterBtn"}
            onDismiss={() => props.setCalloutIsVisible(false)}
        >
            <Stack root={{ style: { width: 473, gap: 13 } }} >
                <Label required className={styles.chooseEquipmentLabel}>Vælg lokalets størrelse</Label>
                <Stack horizontal>
                    <Slider styles={{ root: { width: 503 } }} showValue value={props.searchQuery.eventCapacity}
                        max={props.searchOptions.maxRoomCapacity}
                        onChange={(value: number) => props.updateSearchQuery({ eventCapacity: value })}
                    />
                    <div id={styles.capacityResetBtn} hidden={props.searchQuery.eventCapacity == 0}>
                        <Icon onClick={() => props.updateSearchQuery({ eventCapacity: 0 })} iconName='RemoveFilter' />
                    </div>
                </Stack>
                <Stack horizontal>
                    <Dropdown id='hasLocationDropdown'
                        required
                        label='By'
                        placeholder='Vælg lokalets lokation'
                        selectedKey={props.searchQuery.location}
                        options={props.searchOptions.locations.map((city) => ({ key: city, text: city }))}
                        onChange={(event, option) => props.updateSearchQuery({ location: option.text })}
                    />
                    <div id={styles.locationResetBtn} hidden={props.searchQuery.location == ""} onClick={() => props.updateSearchQuery({ location: "" })}>
                        <Icon iconName='RemoveFilter' />
                    </div>
                </Stack>
                <Label required className={styles.chooseEquipmentLabel} >Vælg Udstyr</Label>
                <Stack horizontal>
                    <Dropdown id='hasDisplayDeviceDropdown'
                        placeholder='Vælg lokalets tv-udstyr'
                        selectedKey={props.searchQuery.hasDisplayDevice}
                        options={props.searchOptions.displayDevices.map((display) => ({ key: display, text: display }))}
                        onChange={(event, option) => props.updateSearchQuery({ hasDisplayDevice: option.text })}
                    />
                    <div id={styles.hasDisplayDeviceResetBtn} hidden={props.searchQuery.hasDisplayDevice == ""} onClick={() => props.updateSearchQuery({ hasDisplayDevice: "" })}>
                        <Icon iconName='RemoveFilter' />
                    </div>
                </Stack>
                <Stack horizontal>
                    <Dropdown id='hasVideoDeviceDropdown'
                        placeholder='Vælg lokalets teams-udstyr'
                        selectedKey={props.searchQuery.hasVideoDevice}
                        options={props.searchOptions.videoDevices.map((video) => ({ key: video, text: video }))}
                        onChange={(event, option) => props.updateSearchQuery({ hasVideoDevice: option.text })}
                    />
                    <div id={styles.hasVideoDeviceResetBtn} hidden={props.searchQuery.hasVideoDevice == ""}
                        onClick={() => props.updateSearchQuery({ hasVideoDevice: "" })}>
                        <Icon iconName='RemoveFilter' />
                    </div>
                </Stack>
            </Stack>
            <Stack className={styles.filterButtons} horizontal>
                <CompoundButton disabled={props.onCheckSearchQueryEmpty()} secondaryText='Filters the rooms' primary onClick={() => props.setCalloutIsVisible(prev => prev == false)} text='Filter' />
                <CompoundButton onClick={() => props.onGenerateEmptySearchQuery()} secondaryText="Cancels the filtration" text='Cancel' />
            </Stack>
        </FocusTrapCallout>
    );
};