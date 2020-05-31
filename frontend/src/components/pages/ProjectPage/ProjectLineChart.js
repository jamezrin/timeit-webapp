import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Box } from '@chakra-ui/core';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle',
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    colors={{ scheme: 'nivo' }}
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

const data = [
  {
    id: 'japan',
    color: 'hsl(329, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 268,
      },
      {
        x: 'helicopter',
        y: 8,
      },
      {
        x: 'boat',
        y: 266,
      },
      {
        x: 'train',
        y: 215,
      },
      {
        x: 'subway',
        y: 230,
      },
      {
        x: 'bus',
        y: 243,
      },
      {
        x: 'car',
        y: 129,
      },
      {
        x: 'moto',
        y: 50,
      },
      {
        x: 'bicycle',
        y: 130,
      },
      {
        x: 'horse',
        y: 114,
      },
      {
        x: 'skateboard',
        y: 9,
      },
      {
        x: 'others',
        y: 71,
      },
      {
        x: 'suckablyat',
        y: 2000,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(136, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 298,
      },
      {
        x: 'helicopter',
        y: 169,
      },
      {
        x: 'boat',
        y: 171,
      },
      {
        x: 'train',
        y: 125,
      },
      {
        x: 'subway',
        y: 289,
      },
      {
        x: 'bus',
        y: 263,
      },
      {
        x: 'car',
        y: 167,
      },
      {
        x: 'moto',
        y: 76,
      },
      {
        x: 'bicycle',
        y: 271,
      },
      {
        x: 'horse',
        y: 61,
      },
      {
        x: 'skateboard',
        y: 3,
      },
      {
        x: 'others',
        y: 252,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(247, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 248,
      },
      {
        x: 'helicopter',
        y: 51,
      },
      {
        x: 'boat',
        y: 287,
      },
      {
        x: 'train',
        y: 82,
      },
      {
        x: 'subway',
        y: 244,
      },
      {
        x: 'bus',
        y: 267,
      },
      {
        x: 'car',
        y: 166,
      },
      {
        x: 'moto',
        y: 202,
      },
      {
        x: 'bicycle',
        y: 50,
      },
      {
        x: 'horse',
        y: 255,
      },
      {
        x: 'skateboard',
        y: 177,
      },
      {
        x: 'others',
        y: 218,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(306, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 41,
      },
      {
        x: 'helicopter',
        y: 191,
      },
      {
        x: 'boat',
        y: 120,
      },
      {
        x: 'train',
        y: 207,
      },
      {
        x: 'subway',
        y: 187,
      },
      {
        x: 'bus',
        y: 32,
      },
      {
        x: 'car',
        y: 163,
      },
      {
        x: 'moto',
        y: 228,
      },
      {
        x: 'bicycle',
        y: 61,
      },
      {
        x: 'horse',
        y: 163,
      },
      {
        x: 'skateboard',
        y: 231,
      },
      {
        x: 'others',
        y: 11,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(349, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 67,
      },
      {
        x: 'helicopter',
        y: 23,
      },
      {
        x: 'boat',
        y: 269,
      },
      {
        x: 'train',
        y: 227,
      },
      {
        x: 'subway',
        y: 264,
      },
      {
        x: 'bus',
        y: 271,
      },
      {
        x: 'car',
        y: 87,
      },
      {
        x: 'moto',
        y: 206,
      },
      {
        x: 'bicycle',
        y: 148,
      },
      {
        x: 'horse',
        y: 276,
      },
      {
        x: 'skateboard',
        y: 151,
      },
      {
        x: 'others',
        y: 135,
      },
    ],
  },
];

const ProjectLineChart = ({ projectInfo, projectMembers }) => (
  <Box height="300px" width="100%">
    <MyResponsiveLine data={data} />
  </Box>
);

export default ProjectLineChart;
