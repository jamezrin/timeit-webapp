import React from 'react';
import { ResponsiveLine, ResponsiveLineCanvas } from '@nivo/line';
import { Box } from '@chakra-ui/core';
import { findProjectMember, formatUserFullName } from '../../../utils';
import moment from 'moment';

const ProjectChartResponsiveLine = ({ data, startDate, endDate }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: false,
      reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'dias',
      legendOffset: 36,
      legendPosition: 'middle',
      // TODO Figure out a better way to do this
      // https://nivo.rocks/guides/axes
      // https://nivo.rocks/line/
      // https://nivo.rocks/storybook/?path=/story/line--time-scale
      format: (tick) => {
        const startDateMoment = moment(startDate);
        const endDateMoment = moment(endDate);
        const diff = endDateMoment.diff(startDateMoment, 'days');
        const currentTickMoment = moment(tick);

        if (diff < 40) {
          return currentTickMoment.format('DD/MM');
        }
      },
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'horas',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    colors={{ scheme: 'paired' }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

const ProjectLineChart = ({
  projectInfo,
  projectMembers,
  projectHistoryStats,
  startDate,
  endDate,
}) => (
  <Box height="300px" width="100%">
    {projectHistoryStats && (
      <ProjectChartResponsiveLine
        data={projectHistoryStats.map((memberHistoryStats) => ({
          id: formatUserFullName(
            findProjectMember(
              projectMembers,
              memberHistoryStats.memberId
            ).user, // prettier-ignore
          ),
          data: memberHistoryStats.data.map((historyData) => ({
            x: moment(historyData.day).format('YYYY-MM-DD'),
            y: Math.round(historyData.minuteSum / 60),
          })),
        }))}
        startDate={startDate}
        endDate={endDate}
      />
    )}
  </Box>
);

export default ProjectLineChart;
