import React from 'react';

import { Flex, Text, Box, useColorMode } from '@chakra-ui/core';
import { sum } from 'react-table/src/aggregations';

const TimeStatIndicatorContent = ({
  title = 'Lorem ipsum dolor sit amet',
  sumValue = '???',
  avgValue = '??',
  minValue = '??',
  maxValue = '??',
}) => {
  return (
    <>
      <Flex direction="row">
        <Text fontSize="lg" lineHeight={1.35}>
          {title}
        </Text>
        <Box ml="auto" pl={3}>
          <Text lineHeight={1} textAlign="center" fontSize="2xl">
            {sumValue > 60 ? Math.floor(sumValue / 60) : sumValue}
          </Text>
          <Text lineHeight={1} textAlign="center" fontSize="md" mt={0}>
            {sumValue > 60 ? 'horas' : 'minutos'}
          </Text>
        </Box>
      </Flex>
      <Box mt="auto">
        <Text fontSize="xs">
          Media por usuario:{' '}
          {avgValue > 60
            ? `${Math.floor(avgValue / 60)} horas`
            : `${avgValue} minutos`}
        </Text>
        <Text fontSize="xs">
          Mínimo{' '}
          {minValue > 60
            ? `${Math.floor(minValue / 60)} horas`
            : `${minValue} minutos`}
          , maximo{' '}
          {maxValue > 60
            ? `${Math.floor(maxValue / 60)} horas`
            : `${maxValue} minutos`}
        </Text>
      </Box>
    </>
  );
};

const TimeStatIndicator = ({
  title = 'Lorem ipsum dolor sit amet',
  sumValue = '???',
  avgValue = '??',
  minValue = '??',
  maxValue = '??',
}) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      p={4}
      mx={4}
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      mt={{ base: '1.5rem', md: '0' }}
      rounded="md"
      shadow="md"
      direction="column"
      flexGrow={1}
      flexShrink={1}
      flexBasis={0}
    >
      <TimeStatIndicatorContent
        title={title}
        sumValue={sumValue}
        avgValue={avgValue}
        minValue={minValue}
        maxValue={maxValue}
      />
    </Flex>
  );
};

function ProjectStatIndicators({ projectInfo, projectStats }) {
  return (
    <>
      {projectStats && (
        <Flex
          direction={{ base: 'column', md: 'row' }}
          mx={-4}
          justifyContent="space-around"
        >
          <TimeStatIndicator
            title="Tiempo invertido en el periodo actual"
            sumValue={projectStats.currentPeriodStatsMinuteSum}
            avgValue={projectStats.currentPeriodStatsMinuteAvg}
            minValue={projectStats.currentPeriodStatsMinuteMin}
            maxValue={projectStats.currentPeriodStatsMinuteMax}
          />
          <TimeStatIndicator
            title="Tiempo invertido en el último dia del periodo"
            sumValue={projectStats.currentPeriodStatsMinuteSum}
            avgValue={projectStats.currentPeriodStatsMinuteAvg}
            minValue={projectStats.currentPeriodStatsMinuteMin}
            maxValue={projectStats.currentPeriodStatsMinuteMax}
          />

          <TimeStatIndicator
            title="Tiempo invertido en la última semana del periodo"
            sumValue={projectStats.currentPeriodStatsMinuteSum}
            avgValue={projectStats.currentPeriodStatsMinuteAvg}
            minValue={projectStats.currentPeriodStatsMinuteMin}
            maxValue={projectStats.currentPeriodStatsMinuteMax}
          />
          <TimeStatIndicator
            title="Tiempo invertido en el último mes del periodo"
            sumValue={projectStats.currentPeriodStatsMinuteSum}
            avgValue={projectStats.currentPeriodStatsMinuteAvg}
            minValue={projectStats.currentPeriodStatsMinuteMin}
            maxValue={projectStats.currentPeriodStatsMinuteMax}
          />
        </Flex>
      )}
    </>
  );
}

export default ProjectStatIndicators;
