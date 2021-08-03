import * as React from "react";
import { Card, Heading, Box, Flex, Button } from "rebass";
import { ScenarioReport } from "../simulation/statistics";

interface ScenarioReportVisProps {
  title: string;
  report: ScenarioReport;
}

const ScenarioReportVis = ({
  title,
  report,
}: ScenarioReportVisProps): JSX.Element => (
  <Box mx="2">
    <Heading>{title}</Heading>
    <p>{(report.playerWinRate * 100).toFixed(0)}%</p>
    <p>
      {report.avgPlayerKOs.mean.toFixed(1)}
      (sd {report.avgPlayerKOs.sd.toFixed(1)})
    </p>
    <p>
      {report.avgPlayerInjuries.mean.toFixed(1)}
      (sd {report.avgPlayerInjuries.sd.toFixed(1)})
    </p>
    <p>
      {Math.round(
        report.avgActionCount.mean - 1.285 * report.avgActionCount.sd
      ).toFixed(0)}
      {" - "}
      {Math.round(
        report.avgActionCount.mean + 1.285 * report.avgActionCount.sd
      ).toFixed(0)}
      {" min"}
    </p>
    <p>
      {Math.round(
        report.avgRoundCount.mean - 1.285 * report.avgRoundCount.sd
      ).toFixed(0)}
      {" - "}
      {Math.round(
        report.avgRoundCount.mean + 1.285 * report.avgRoundCount.sd
      ).toFixed(0)}
      {" rounds"}
    </p>
  </Box>
);

interface StatsVisProps {
  reports: ScenarioReport[];
  triggerNewSimulation: () => void;
}

export const StatsVis = ({ reports, triggerNewSimulation }: StatsVisProps) => {
  // Grab the last 10 reports
  let reportVis: JSX.Element;
  if (reports.length > 0) {
    let index = reports.length - 1;
    reportVis = (
      <ScenarioReportVis
        key="current"
        title="Current"
        report={reports[index]}
      />
    );
  } else {
    reportVis = (
      <Box key="empty" mx="2">
        <Heading>None</Heading>
        <p>-</p>
        <p>-</p>
        <p>-</p>
        <p>-</p>
        <p>-</p>
      </Box>
    );
  }
  return (
    <Card
      sx={{
        p: 2,
        m: 2,
        borderRadius: 2,
        boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
      }}
    >
      <Flex flexWrap="wrap">
        <Box mx="2">
          <Heading>Statistics</Heading>
          <p>Win Rate</p>
          <p>Player KOs</p>
          <p>Player Injuries</p>
          <p>Estimated Time</p>
          <p>Number of Rounds</p>
        </Box>
        {reportVis}
      </Flex>
      <Button onClick={triggerNewSimulation}>Simulate Combat</Button>
    </Card>
  );
};
