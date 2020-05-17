import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import {
  IconButton,
  Icon,
  Code,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  List,
  ListItem,
  PseudoBox,
} from '@chakra-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(projectsEndpoint + '/' + projectId, { withCredentials: true });
const requestProjectSessions = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}/sessions`, { withCredentials: true });
const requestProjectMembers = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true });

function ProjectPageContent({ projectInfo }) {
  const history = useHistory();

  const [sessions, setSessions] = useState(null);
  const [projectMembers, setProjectMembers] = useState(null);

  const projectMemberOptions = useMemo(() => {
    if (!projectMembers) return null;
    return projectMembers.map((projectMember) => {
      return {
        label: `${projectMember.user.firstName} ${projectMember.user.lastName}`,
        value: projectMember.id,
      };
    });
  }, [projectMembers]);

  const defaultProjectMember = useMemo(() => {
    if (!projectMemberOptions) return null;
    return projectMemberOptions.find((option) => {
      return option.value === projectInfo.projectMember.id;
    });
  }, [projectMemberOptions, projectInfo]);

  useEffect(() => {
    requestProjectSessions(projectInfo.id).then((res) => {
      setSessions(res.data);
    });

    requestProjectMembers(projectInfo.id).then((res) => {
      setProjectMembers(res.data);
    });
  }, [projectInfo]);

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
        <Box maxWidth="20rem">
          {projectMemberOptions && (
            <Select defaultValue={[defaultProjectMember]} options={projectMemberOptions} isMulti />
          )}
        </Box>

        <pre>{JSON.stringify(projectMembers, '', 4)}</pre>
        <pre>{JSON.stringify(projectMemberOptions, '', 4)}</pre>

        <pre>{JSON.stringify(projectInfo, '', 4)}</pre>
        <pre>{sessions ? JSON.stringify(sessions, '', 4) : 'Loading...'}</pre>
      </Box>
    </Box>
  );
}

function ProjectPage(props) {
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

export default ProjectPage;
