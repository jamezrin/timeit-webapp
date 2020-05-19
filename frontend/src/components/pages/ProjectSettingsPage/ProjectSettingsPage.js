import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../base/MainLayout';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import RenameProjectSettings from './RenameProjectSettings';
import ProjectMemberList from './ProjectMemberList';
import InviteProjectSettings from './InviteProjectSettings';
import DeleteProjectSettings from './DeleteProjectSettings';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });

function ProjectPageContent({ projectInfo, setProjectInfo }) {
  const history = useHistory();

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

      {/* TODO: Prevent users that are not admins accessing this */}
      <Flex direction={{ base: 'column', lg: 'row' }}>
        <Box width={{ base: '100%', lg: '50%' }}>
          <Box mx={8}>
            <ProjectMemberList projectInfo={projectInfo} />
          </Box>
        </Box>
        <Box width={{ base: '100%', lg: '50%' }}>
          <Box mx={8}>
            <RenameProjectSettings projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
            <InviteProjectSettings projectInfo={projectInfo} />
            <DeleteProjectSettings projectInfo={projectInfo} />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

function ProjectSettingsPage() {
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
        <ProjectPageContent projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
      ) : (
        <FullPageLoadSpinner message="Cargando el proyecto actual" />
      )}
    </MainLayout>
  );
}

export default ProjectSettingsPage;
