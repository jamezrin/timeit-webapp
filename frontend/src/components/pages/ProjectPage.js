import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { Box, Button, Flex, List, ListItem, PseudoBox, useColorMode } from '@chakra-ui/core';
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectMembers = (projectId) => axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true }); // prettier-ignore
const requestProjectSessions = (projectId, memberIds = []) => axios.get(`${projectsEndpoint}/${projectId}/sessions`, {
  withCredentials: true,
  params: { memberIds }
}); // prettier-ignore

function ProjectPageMemberSelect({ projectInfo, updateSelectedProjectMembers }) {
  const [projectMembers, setProjectMembers] = useState(null);

  const projectMemberOptions = useMemo(() => {
    if (!projectMembers) return null;
    return projectMembers
      .filter((projectMember) => {
        // If we are ourselves, we obviously have access to our own metrics
        // If we are admins or employers, we have access to the metrics of everyone
        return (
          projectMember.id === projectInfo.projectMember.id ||
          projectInfo.projectMember.role === 'admin' ||
          projectInfo.projectMember.role === 'employer'
        );
      })
      .map((projectMember) => {
        return {
          label: `${projectMember.user.firstName} ${projectMember.user.lastName}`,
          value: projectMember.id,
        };
      });
  }, [projectInfo, projectMembers]);

  const defaultProjectMember = useMemo(() => {
    if (!projectMemberOptions) return null;
    return projectMemberOptions.find((option) => {
      return option.value === projectInfo.projectMember.id;
    });
  }, [projectMemberOptions, projectInfo]);

  useEffect(() => {
    requestProjectMembers(projectInfo.id).then((res) => {
      setProjectMembers(res.data);
    });
  }, [projectInfo]);

  useEffect(() => {
    if (defaultProjectMember) {
      updateSelectedProjectMembers([defaultProjectMember]);
    } else {
      updateSelectedProjectMembers(null);
    }
  }, [updateSelectedProjectMembers, defaultProjectMember]);

  const handleSelectChange = useCallback(
    (data) => {
      if (!data || data.length === 0) {
        updateSelectedProjectMembers(null);
      } else {
        updateSelectedProjectMembers(data);
      }
    },
    [updateSelectedProjectMembers],
  );

  return (
    <Box maxWidth="20rem">
      {projectMemberOptions && (
        <Select
          defaultValue={[defaultProjectMember]}
          options={projectMemberOptions}
          onChange={handleSelectChange}
          isMulti
        />
      )}
    </Box>
  );
}

function ProjectPageContent({ projectInfo }) {
  const [sessions, setSessions] = useState(null);
  const { colorMode } = useColorMode();
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
        <ProjectPageMemberSelect
          projectInfo={projectInfo}
          updateSelectedProjectMembers={updateSelectedProjectMembers}
        />
        <List mt={12}>
          {sessions &&
            sessions.map((session) => (
              <ListItem key={session.id}>
                <Link to={`/project/${projectInfo.id}/session/${session.id}`}>
                  <PseudoBox
                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                    shadow="md"
                    p={6}
                    mb={4}
                    _hover={{
                      transform: 'scale(1.03)',
                    }}
                  >
                    Sesión {session.id}
                  </PseudoBox>
                </Link>
              </ListItem>
            ))}
        </List>
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
