import React, { useCallback, useEffect, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import RenameProjectSettings from './RenameProjectSettings';
import ProjectMemberList from './ProjectMemberList';
import InviteProjectSettings from './InviteProjectSettings';
import DeleteProjectSettings from './DeleteProjectSettings';
import useDocumentTitle from '../../hooks/documentTitleHook';
import MainLayout from '../MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { formatTitle, isMemberPrivileged, isResponseError } from '../../utils';
import { useToasts } from 'react-toast-notifications';
import { RESOURCE_NOT_FOUND_ERROR } from '@timeit/common';
import { requestProjectInfo, requestProjectMembers } from '../../api';

function ProjectPageContent({ projectInfo, setProjectInfo }) {
  const [projectMembers, setProjectMembers] = useState();
  const { addToast } = useToasts();
  const history = useHistory();

  useEffect(() => {
    if (!isMemberPrivileged(projectInfo.projectMember)) {
      history.replace(`/project/${projectInfo.id}`);
    }
  }, [history, projectInfo]);

  const updateMembers = useCallback(() => {
    requestProjectMembers(projectInfo.id)
      .then((res) => {
        setProjectMembers(res.data);
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [addToast, projectInfo]);

  return (
    <Flex direction="column" py={10} mx={8}>
      <Flex mb={12}>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="gray"
          variant="ghost"
          whiteSpace="pre"
          onClick={() => history.push(`/project/${projectInfo.id}`)}
        >
          {projectInfo.name || 'Proyecto sin nombre'}
        </Button>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }}>
        <Flex
          width={{ base: '100%', lg: '60%' }}
          height={{ base: '30rem', lg: 'auto' }}
          mx={{ base: 0, lg: 8 }}
          direction="column"
        >
          <ProjectMemberList
            projectInfo={projectInfo}
            projectMembers={projectMembers}
            updateMembers={updateMembers}
          />
        </Flex>
        <Flex
          width={{ base: '100%', lg: '40%' }}
          mx={{ base: 0, lg: 8 }}
          direction="column"
        >
          <RenameProjectSettings
            projectInfo={projectInfo}
            setProjectInfo={setProjectInfo}
          />
          <InviteProjectSettings
            projectInfo={projectInfo}
            updateMembers={updateMembers}
          />
          <DeleteProjectSettings projectInfo={projectInfo} />
        </Flex>
      </Flex>
    </Flex>
  );
}

function ProjectSettingsPage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const { projectId } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();

  useDocumentTitle(formatTitle('Ajustes de proyecto'));

  useEffect(() => {
    requestProjectInfo(projectId)
      .then((res) => {
        setProjectInfo(res.data);
      })
      .catch((err) => {
        if (isResponseError(err, RESOURCE_NOT_FOUND_ERROR)) {
          addToast(`No se ha podido encontrar la sesión que has pedido`, {
            appearance: 'error',
            autoDismiss: true,
          });

          history.push('/');
        } else {
          addToast(`Ha ocurrido un error desconocido: ${err}`, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }, [history, addToast, projectId]);

  return (
    <MainLayout>
      {projectInfo ? (
        <ProjectPageContent
          projectInfo={projectInfo}
          setProjectInfo={setProjectInfo}
        />
      ) : (
        <FullPageLoadSpinner message="Cargando el proyecto actual" />
      )}
    </MainLayout>
  );
}

export default ProjectSettingsPage;
