import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../base/MainLayout';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import SelectProjectMember from './SelectProjectMember';
import ProjectSessionList from './ProjectSessionList';
import PeriodDateRangePicker from './PeriodDateRangePicker';
import moment from 'moment';

moment.locale('es');

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectSessions = (projectId, startDate, endDate, memberIds = []) =>
  axios.get(`${projectsEndpoint}/${projectId}/sessions`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });

const projectStatisticsEndpoint = process.env.REACT_APP_BACKEND_URL + '/data_query/statistics';
const requestProjectStatistics = (projectId, startDate, endDate, memberIds = []) =>
  axios.get(`${projectStatisticsEndpoint}/${projectId}`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });

function ProjectPageContent({ projectInfo }) {
  const history = useHistory();

  const [projectMembers, setProjectMembers] = useState(null);
  const updateProjectMembers = useCallback((projectMembers) => {
    if (projectMembers) {
      setProjectMembers(projectMembers.map((projectMember) => projectMember.value));
    } else {
      setProjectMembers(projectMembers);
    }
  }, []);

  const [startDate, setStartDate] = useState(moment().set('date', 1));
  const [endDate, setEndDate] = useState(moment());
  const updateDates = useCallback(({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const [sessions, setSessions] = useState(null);
  useEffect(() => {
    if (projectMembers) {
      requestProjectStatistics(projectInfo.id, startDate, endDate, projectMembers).then((res) => {
        console.log(res.data);
      });
      requestProjectSessions(projectInfo.id, startDate, endDate, projectMembers).then((res) => {
        setSessions(res.data);
      });
    } else {
      setSessions(null);
    }
  }, [projectInfo, projectMembers, startDate, endDate]);

  return (
    <Box py={10} mx={8}>
      <Flex mb={12}>
        <Button leftIcon="arrow-back" variantColor="gray" variant="ghost" size="lg" onClick={() => history.push('/')}>
          {projectInfo.name}
        </Button>
        <Button
          rightIcon="settings"
          variantColor="gray"
          variant="ghost"
          ml="auto"
          onClick={() => history.push(`/project/${projectInfo.id}/settings`)}
        >
          Ajustes
        </Button>
      </Flex>

      <Box mx={8}>
        <Flex direction="row" alignItems="center">
          <Box width="20rem">
            <SelectProjectMember projectInfo={projectInfo} updateSelectedProjectMembers={updateProjectMembers} />
          </Box>
          <Box ml="auto">
            <PeriodDateRangePicker
              startDate={startDate}
              endDate={endDate}
              projectInfo={projectInfo}
              onDatesChange={updateDates}
            />
          </Box>
        </Flex>

        <ProjectSessionList projectInfo={projectInfo} sessions={sessions} />
      </Box>
    </Box>
  );
}

function ProjectPage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const { projectId } = useParams();

  useEffect(() => {
    requestProjectInfo(projectId).then((res) => {
      setProjectInfo(res.data);
    });
  }, [projectId]);

  return (
    <MainLayout>
      {projectInfo ? (
        <ProjectPageContent projectInfo={projectInfo} />
      ) : (
        <FullPageLoadSpinner message="Cargando el proyecto actual" />
      )}
    </MainLayout>
  );
}

export default ProjectPage;
