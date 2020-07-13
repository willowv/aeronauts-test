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
    <p>{(report.playerInjuryRate * 100).toFixed(0)}%</p>
    <p>
      {report.avgActionCount.mean.toFixed(2)}
      (sd {report.avgActionCount.sd.toFixed(2)})
    </p>
    <p>
      {report.avgEnemyActionCount.mean.toFixed(2)}
      (sd {report.avgEnemyActionCount.sd.toFixed(2)})
    </p>
    <p>
      {report.avgRoundCount.mean.toFixed(2)}
      (sd {report.avgRoundCount.sd.toFixed(2)})
    </p>
  </Box>
);

interface StatsVisProps {
  reports: ScenarioReport[];
  triggerNewSimulation: () => void;
}

export const StatsVis = ({ reports, triggerNewSimulation }: StatsVisProps) => {
  // Grab the last 10 reports
  let reportVis: JSX.Element[];
  if (reports.length > 0) {
    let reportsToDisplay = reports
      .slice(Math.max(reports.length - 10, 0))
      .reverse();
    reportVis = reportsToDisplay.map((report, index) => {
      let title = index === 0 ? "Current" : "Current -" + index;
      return <ScenarioReportVis title={title} report={report} />;
    });
  } else {
    reportVis = [
      <Box mx="2">
        <Heading>None</Heading>
        <p>-</p>
        <p>-</p>
        <p>-</p>
        <p>-</p>
        <p>-</p>
      </Box>,
    ];
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
          <p>Injury Rate</p>
          <p>Total Actions</p>
          <p>Enemy Actions</p>
          <p>Number of Rounds</p>
        </Box>
        {reportVis}
      </Flex>
      <Button onClick={triggerNewSimulation}>Simulate Combat</Button>
    </Card>
  );
};
