import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../base/MainLayout';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/core';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const sessionsEndpoint = process.env.REACT_APP_BACKEND_URL + '/sessions';
const requestSessionInfo = (sessionId) =>
  axios.get(`${sessionsEndpoint}/${sessionId}`, { withCredentials: true });
const sessionEventEndpoint =
  process.env.REACT_APP_BACKEND_URL + '/data_query/session_events';
const requestSessionEvents = (sessionId) =>
  axios.get(`${sessionEventEndpoint}/${sessionId}`, { withCredentials: true });

function ProjectSessionContent({ projectInfo, sessionInfo }) {
  const history = useHistory();

  const [sessionEvents, setSessionEvents] = useState([]);

  const loadMoreRows = useCallback(
    ({ startIndex, stopIndex }) => {
      console.log('load more', { startIndex, stopIndex });
      requestSessionEvents(sessionInfo.id).then((res) => {
        setSessionEvents([...sessionEvents, ...res.data]);
      });
    },
    [sessionInfo, sessionEvents],
  );

  const isRowLoaded = ({ index }) => {
    return !!sessionEvents[index];
  };

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div key={key} style={{ ...style, overflow: 'hidden' }}>
        {JSON.stringify(sessionEvents[index])}
      </div>
    );
  };

  const remoteRowCount = 20000;

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
      <pre>{JSON.stringify(sessionInfo, '', 4)}</pre>
      <InfiniteLoader
        loadMoreRows={loadMoreRows}
        isRowLoaded={isRowLoaded}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            rowCount={remoteRowCount}
            rowHeight={20}
            rowRenderer={rowRenderer}
            height={900}
            width={900}
          />
        )}
      </InfiniteLoader>
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
        <ProjectSessionContent
          projectInfo={projectInfo}
          sessionInfo={sessionInfo}
        />
      ) : (
        <FullPageLoadSpinner message="Cargando la sesión seleccionada" />
      )}
    </MainLayout>
  );
}

export default ProjectSessionPage;
