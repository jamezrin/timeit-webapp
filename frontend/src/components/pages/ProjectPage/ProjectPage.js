import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../base/MainLayout';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import SelectProjectMember from './SelectProjectMember';
import ProjectSessionList from './ProjectSessionList';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectSessions = (projectId, memberIds = []) => axios.get(`${projectsEndpoint}/${projectId}/sessions`, {
  withCredentials: true,
  params: { memberIds }
}); // prettier-ignore

function ProjectPageContent({ projectInfo }) {
  const [sessions, setSessions] = useState(null);
  const history = useHistory();

  const updateSelectedProjectMembers = useCallback(
    (projectMembers) => {
      if (projectMembers) {
        requestProjectSessions(
          projectInfo.id,
          projectMembers.map((member) => member.value),
        ).then((res) => setSessions(res.data));
      } else {
        setSessions(null);
      }
    },
    [projectInfo],
  );

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
        <SelectProjectMember projectInfo={projectInfo} updateSelectedProjectMembers={updateSelectedProjectMembers} />
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
