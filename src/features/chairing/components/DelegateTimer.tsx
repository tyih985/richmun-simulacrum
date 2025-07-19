import { TimerBar } from "@components/Timer";
import { DelegateDoc } from "@features/types";
import { Stack, Title } from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  delegate: DelegateDoc;
};

export const DelegateTimer = ({ delegate }: Props): ReactElement => {
    return (
        <Stack>
            {/* <Text></Text> TODO: bc i realize the countriesData should probably be a map bc rn its cringe and you have to iterate through the whole thing and no one wants to do that*/ }
            <Title>
                {delegate.name}
            </Title>
            <TimerBar></TimerBar>
        </Stack>
    )
}