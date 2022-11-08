import { DefaultButton, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { ToolbarProps } from 'react-big-calendar';

export interface ICustomToolbarProps {
    toolbar: ToolbarProps;
 }

export const CustomToolbar: React.FunctionComponent<ICustomToolbarProps> = (props: React.PropsWithChildren<ICustomToolbarProps>) => {
    return (
        <Stack horizontal tokens={{ childrenGap: "9px" }} className='rbc-toolbar'>
            <PrimaryButton onClick={() => props.toolbar.onNavigate("PREV")} text='Previous' />
            <DefaultButton onClick={() => props.toolbar.onNavigate("NEXT")} text='Next' />
        </Stack>
    );
};