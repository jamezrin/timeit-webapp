import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(projectsEndpoint + '/' + projectId, { withCredentials: true });
const requestProjectSessions = (projectId, memberIds = []) =>
  axios.get(`${projectsEndpoint}/${projectId}/sessions`, { withCredentials: true, params: { memberIds } });
const requestProjectMembers = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true });

function ProjectPageMemberSelect({ projectInfo, updateSelectedProjectMembers }) {
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
  const history = useHistory();
  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    requestProjectSessions(projectInfo.id).then((res) => {});
  }, [projectInfo]);

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

        <pre>{JSON.stringify(sessions, null, 2)}</pre>
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
