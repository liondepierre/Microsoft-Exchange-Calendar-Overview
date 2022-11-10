import { PrimaryButton, Stack, Text } from 'office-ui-fabric-react';
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx, GraphFI } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';

export interface IGraphApiTestProps {
    context: WebPartContext;
}

export const GraphApiTest: React.FunctionComponent<IGraphApiTestProps> = (props: React.PropsWithChildren<IGraphApiTestProps>) => {

    const [calendarEvent, setCalendarSubject] = React.useState<any>([])

    let graph: GraphFI;
    let k: any;

    React.useEffect(() => {
        graph = graphfi().using(SPFx(props.context));
        k = getSpecificCalendar();
    }, []);


    const getSpecificCalendar = async () => {
        const myCalendar = await graph.me.events();
        setCalendarSubject(myCalendar)
    }

    return (
        <Stack>
            {calendarEvent.map((calendar) => {
                return (
                    <Text variant={'xxLargePlus'}>
                        {calendar.subject}
                    </Text>
                )
            })}
        </Stack>
    );
};

