import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import ProjectStatIndicators from './ProjectStatIndicators';
import ProjectLineChart from './ProjectLineChart';
import ProjectSessionList from './ProjectSessionList';

export default function ProjectPageInfo({
  projectInfo,
  projectMembers,
  projectStats,
  projectHistoryStats,
  sessions,
  startDate,
  endDate,
}) {
  return (
    <Box>
      <Box mt={8}>
        <Heading as="h2" size="lg" mb={3}>
          Estadisticas
        </Heading>
        <ProjectStatIndicators
          projectInfo={projectInfo}
          projectStats={projectStats}
        />
        <ProjectLineChart
          projectInfo={projectInfo}
          projectMembers={projectMembers}
          projectHistoryStats={projectHistoryStats}
          startDate={startDate}
          enDate={endDate}
        />
      </Box>

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={3}>
          Sesiones (
          {projectStats
            ? projectStats.currentPeriodSessionCount
            : 'Desconocido'}
          )
        </Heading>
        <ProjectSessionList
          projectInfo={projectInfo}
          sessions={sessions}
          projectMembers={projectMembers}
        />
      </Box>
    </Box>
  );
}
