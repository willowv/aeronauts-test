import * as React from "react";
import { Card, Heading, Box, Flex, Button } from "rebass";
import { Label } from "@rebass/forms";
import { ScenarioReport } from "../simulator/simulator";

interface StatsVisProps {
    reports : ScenarioReport[];
    triggerNewSimulation : () => void;
}

function ScenarioReportVis(heading : string, report : ScenarioReport) : JSX.Element {
    return (
        <Box mx='2'>
            <Heading>{heading}</Heading>
            <p>{`${(report.playerWinRate * 100).toFixed(0)}%`}</p>
            <p>{`${(report.playerInjuryRate * 100).toFixed(0)}%`}</p>
            <p>{`${report.avgActionCount.mean.toFixed(2)} (sd ${report.avgActionCount.sd.toFixed(2)})`}</p>
            <p>{`${report.avgEnemyActionCount.mean.toFixed(2)} (sd ${report.avgEnemyActionCount.sd.toFixed(2)})`}</p>
            <p>{`${report.avgRoundCount.mean.toFixed(2)} (sd ${report.avgRoundCount.sd.toFixed(2)})`}</p>
        </Box>
    );
}

export class StatsVis extends React.Component<StatsVisProps> {
    render() {
        // Grab the last 10 reports
        let reportVis : JSX.Element[];
        if(this.props.reports.length > 0) {
            let reportsToDisplay = this.props.reports.slice(Math.max(this.props.reports.length - 10, 0)).reverse();
            reportVis = reportsToDisplay.map((report, index) => {
                let title = (index == 0) ? 'Current' : 'Current -'+index;
                return ScenarioReportVis(title, report);
        })
        } else {
            reportVis = [(<Box mx='2' >
            <Heading>None</Heading>
                <p>-</p>
                <p>-</p>
                <p>-</p>
                <p>-</p>
                <p>-</p>
            </Box>)]
        }
        return (
        <Card
            sx={{p: 2, m:2, borderRadius: 2, boxShadow: '0 0 16px rgba(0, 0, 0, .25)'}}>
            <Flex flexWrap='wrap'>
                <Box mx='2' >
                    <Heading>Statistics</Heading>
                    <p>Win Rate</p>
                    <p>Injury Rate</p>
                    <p>Total Actions</p>
                    <p>Enemy Actions</p>
                    <p>Number of Rounds</p>
                </Box>
                {reportVis}
            </Flex>
            <Button onClick={this.props.triggerNewSimulation}>
                Simulate Combat
            </Button>
        </Card>);
    }
}