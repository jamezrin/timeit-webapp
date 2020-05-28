import { Box, Heading } from '@chakra-ui/core';
import ProjectStatIndicators from './ProjectStatIndicators';
import ProjectLineChart from './ProjectLineChart';
import ProjectSessionList from './ProjectSessionList';
import React from 'react';

export default function ProjectPageInfo({
  projectInfo,
  projectMembers,
  projectStats,
  sessions,
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
        <ProjectLineChart />
      </Box>

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={3}>
          Sesiones (
          {projectStats ? projectStats.currentPeriodStatsCount : 'Desconocido'})
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
