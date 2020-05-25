import React from 'react';

import { Flex, Text, Box, useColorMode } from '@chakra-ui/core';

const TimeStatIndicatorContent = ({
  title,
  sumValue,
  avgValue,
  minValue,
  maxValue,
}) => {
  return (
    <>
      <Flex direction="row">
        <Text fontSize="lg" lineHeight={1.35}>
          {title}
        </Text>
        <Box ml="auto" pl={3}>
          <Text lineHeight={1} textAlign="center" fontSize="2xl">
            {sumValue}
          </Text>
          <Text lineHeight={1} fontSize="md" mt={0}>
            horas
          </Text>
        </Box>
      </Flex>
      <Box mt="auto">
        <Text fontSize="xs">Media por usuario: {avgValue} horas</Text>
        <Text fontSize="xs">
          Mínimo {minValue} horas, maximo {maxValue} horas
        </Text>
      </Box>
    </>
  );
};

const TimeStatIndicator = ({
  title,
  sumValue,
  avgValue,
  minValue,
  maxValue,
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

TimeStatIndicator.defaultProps = {
  title: 'Lorem ipsum dolor sit amet',
  sumValue: '???',
  avgValue: '??',
  minValue: '??',
  maxValue: '??',
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
            sumValue={projectStats.currentPeriodStatsHourSum}
            avgValue={projectStats.currentPeriodStatsHourAvg}
            minValue={projectStats.currentPeriodStatsHourMin}
            maxValue={projectStats.currentPeriodStatsHourMax}
          />
          <TimeStatIndicator
            title="Tiempo invertido en el último mes del periodo"
            sumValue={projectStats.currentPeriodStatsHourSum}
            avgValue={projectStats.currentPeriodStatsHourAvg}
            minValue={projectStats.currentPeriodStatsHourMin}
            maxValue={projectStats.currentPeriodStatsHourMax}
          />
          <TimeStatIndicator
            title="Tiempo invertido en la última semana del periodo"
            sumValue={projectStats.currentPeriodStatsHourSum}
            avgValue={projectStats.currentPeriodStatsHourAvg}
            minValue={projectStats.currentPeriodStatsHourMin}
            maxValue={projectStats.currentPeriodStatsHourMax}
          />
          <TimeStatIndicator
            title="Tiempo invertido en el último dia del periodo"
            sumValue={projectStats.currentPeriodStatsHourSum}
            avgValue={projectStats.currentPeriodStatsHourAvg}
            minValue={projectStats.currentPeriodStatsHourMin}
            maxValue={projectStats.currentPeriodStatsHourMax}
          />
        </Flex>
      )}
    </>
  );
}

export default ProjectStatIndicators;
