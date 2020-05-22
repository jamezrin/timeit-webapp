import React, { useEffect, useState } from 'react';
import MainLayout from '../../base/MainLayout';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/core';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const sessionsEndpoint = process.env.REACT_APP_BACKEND_URL + '/sessions';
const requestSessionInfo = (sessionId) => axios.get(`${sessionsEndpoint}/${sessionId}`, { withCredentials: true });
const sessionEventEndpoint = process.env.REACT_APP_BACKEND_URL + '/data_query/session_events';
const requestSessionEvents = (sessionId) => axios.get(`${sessionEventEndpoint}/${sessionId}`, { withCredentials: true }); // prettier-ignore

function ProjectSessionContent({ projectInfo, sessionInfo }) {
  const [sessionEvents, setSessionEvents] = useState(null);
  const history = useHistory();

  useEffect(() => {
    requestSessionEvents(sessionInfo.id).then((res) => {
      setSessionEvents(res.data);
    });
  }, [sessionInfo]);

  // TODO: https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md
  return (
    <Flex direction="column" py={10} mx={8}>
      <Flex mb={12}>
        <Button
          leftIcon="arrow-back"
          variantColor="gray"
          variant="ghost"
          size="lg"
          onClick={() => history.push(`/project/${projectInfo.id}`)}
        >
          {projectInfo.name || 'Proyecto sin nombre'}
        </Button>
      </Flex>

      <pre>{JSON.stringify(projectInfo, '', 4)}</pre>
      <pre>{JSON.stringify(sessionInfo, '', 4)}</pre>
      <pre>{JSON.stringify(sessionEvents, '', 4)}</pre>
    </Flex>
  );
}

function ProjectSessionPage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const { projectId, sessionId } = useParams();

  useEffect(() => {
    requestProjectInfo(projectId).then((response) => {
      setProjectInfo(response.data);
    });
  }, [projectId]);

  useEffect(() => {
    requestSessionInfo(sessionId).then((response) => {
      setSessionInfo(response.data);
    });
  }, [sessionId]);

  return (
    <MainLayout>
      {projectInfo && sessionInfo ? (
        <ProjectSessionContent projectInfo={projectInfo} sessionInfo={sessionInfo} />
      ) : (
        <FullPageLoadSpinner message="Cargando la sesión seleccionada" />
      )}
    </MainLayout>
  );
}

export default ProjectSessionPage;
