import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import {
  IconButton,
  Box,
  Icon,
  Link,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  PseudoBox,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Divider,
  InputGroup,
} from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) => axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectDelete = (projectId) => axios.delete(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectMembers = (projectId) => axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true }); // prettier-ignore
const requestProjectRename = (projectId, name) => axios.patch(`${projectsEndpoint}/${projectId}`, { name }, { withCredentials: true }); // prettier-ignore
const requestProjectInvite = (projectId, emailAddress) => axios.post(`${projectsEndpoint}/${projectId}/invite`, { emailAddress }, { withCredentials: true }); // prettier-ignore

function ProjectDeleteComponent({ projectInfo }) {
  const [typedProjectName, setTypedProjectName] = useState('');
  const { addToast } = useToasts();
  const history = useHistory();

  const deleteProject = useCallback(() => {
    requestProjectDelete(projectInfo.id)
      .then((res) => {
        history.push('/');
        addToast(`Has borrado el proyecto "${projectInfo.name}"`, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [projectInfo, history, addToast]);

  return (
    <Box p={4} mt={12} bg="gray.100" rounded="md">
      <Heading as="h2" size="md">
        Borrar proyecto
      </Heading>

      <Divider />

      <Text mt={4}>
        Confirma que quieres borrar este proyecto escribiendo su nombre debajo. Una vez borres el proyecto, se borrarán
        todas las sesiones, eventos de aplicación y notas relacionados permanentemente.
      </Text>

      <InputGroup mt={4}>
        <Input
          name="projectName"
          id="projectName"
          type="text"
          placeholder="Nombre de proyecto"
          value={typedProjectName}
          onChange={(e) => setTypedProjectName(e.target.value)}
        />

        <Button
          ml={6}
          px={6}
          variantColor="red"
          disabled={typedProjectName !== projectInfo.name}
          onClick={deleteProject}
        >
          Borrar proyecto
        </Button>
      </InputGroup>
    </Box>
  );
}

function ProjectInviteComponent({ projectInfo }) {
  const [emailAddress, setEmailAddress] = useState('');
  const { addToast } = useToasts();

  const inviteUser = useCallback(() => {
    requestProjectInvite(projectInfo.id, emailAddress)
      .then((res) => {
        addToast(`Has enviado una invitación a "${emailAddress}"`, {
          appearance: 'success',
          autoDismiss: true,
        });

        setEmailAddress('');
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          if (err.response.data.error.type === 'ACCOUNT_NOT_FOUND') {
            addToast('No existe ningún usuario con ese correo electrónico', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          addToast(`Ha ocurrido un error desconocido: ${err}`, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }, [projectInfo, emailAddress, addToast]);

  return (
    <Box p={4} mt={12} bg="gray.100" rounded="md">
      <Heading as="h2" size="md">
        Invitar a usuario
      </Heading>

      <Divider />

      <Text mt={4}>
        Invita a un usuario para monitorizar su trabajo. Podrás cambiar su rol en la lista de miembros. Aparecerá al
        aceptar la invitación.
      </Text>

      <InputGroup mt={4}>
        <Input
          name="projectName"
          id="projectName"
          type="text"
          placeholder="Correo electrónico"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />

        <Button ml={6} px={6} variantColor="blue" onClick={inviteUser}>
          Invitar usuario
        </Button>
      </InputGroup>
    </Box>
  );
}

function ProjectRenameComponent({ projectInfo, setProjectInfo }) {
  const [projectName, setProjectName] = useState('');
  const { addToast } = useToasts();

  const inviteUser = useCallback(() => {
    requestProjectRename(projectInfo.id, projectName)
      .then((res) => {
        addToast(`Has cambiado el nombre del proyecto a "${projectName}"`, {
          appearance: 'success',
          autoDismiss: true,
        });

        setProjectInfo({
          ...projectInfo,
          name: projectName,
        });

        setProjectName('');
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [projectInfo, setProjectInfo, projectName, addToast]);

  return (
    <Box p={4} mt={12} bg="gray.100" rounded="md">
      <Heading as="h2" size="md">
        Cambiar nombre de proyecto
      </Heading>

      <Divider />

      <Text mt={4}>Aquí puedes cambiar el nombre del proyecto.</Text>

      <InputGroup mt={4}>
        <Input
          name="projectName"
          id="projectName"
          type="text"
          placeholder="Nombre de proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <Button ml={6} px={6} variantColor="blue" onClick={inviteUser}>
          Cambiar nombre
        </Button>
      </InputGroup>
    </Box>
  );
}

function ProjectMembersComponent({ projectInfo }) {
  const [members, setMembers] = useState(null);
  const { addToast } = useToasts();

  useEffect(() => {
    requestProjectMembers(projectInfo.id)
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  }, [addToast, projectInfo]);

  return (
    <Box p={4} mt={12} bg="gray.100" rounded="md">
      <Heading as="h2" size="md">
        Miembros del proyecto
      </Heading>

      <Divider />

      <List mt={4}>
        {members &&
          members.map((member) => (
            <ListItem
              key={member.id}
              bg="white"
              p="3"
              _hover={{
                transform: 'scale(1.01)',
              }}
            >
              {member.user.firstName} {member.user.lastName}
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

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
            <ProjectMembersComponent projectInfo={projectInfo} />
          </Box>
        </Box>
        <Box width={{ base: '100%', lg: '50%' }}>
          <Box mx={8}>
            <ProjectRenameComponent projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
            <ProjectInviteComponent projectInfo={projectInfo} />
            <ProjectDeleteComponent projectInfo={projectInfo} />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

function ProjectSettingsPage(props) {
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
