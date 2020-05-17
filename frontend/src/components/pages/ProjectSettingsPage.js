import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { IconButton, Icon, Link, Button, ButtonGroup, Flex, Heading, List, ListItem, PseudoBox } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(projectsEndpoint + '/' + projectId, { withCredentials: true });
const requestProjectSessions = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}/sessions`, { withCredentials: true });

function ProjectPageContent({ projectInfo }) {
  const history = useHistory();

  const [sessions, setSessions] = useState(null);
  useEffect(() => {
    requestProjectSessions(projectInfo.id).then((res) => {
      setSessions(res.data);
    });
  }, [projectInfo]);

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
          {projectInfo.name}
        </Button>
      </Flex>

      <pre>{JSON.stringify(projectInfo, '', 4)}</pre>

      <pre>{sessions ? JSON.stringify(sessions, '', 4) : 'Loading...'}</pre>
    </Flex>
  );
}

function ProjectSettingsPage(props) {
  const [projectInfo, setProjectInfo] = useState(null);
  const projectId = props.match.params.projectId;

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

export default ProjectSettingsPage;
