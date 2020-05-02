import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PseudoBox,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/core';

import workTimeSvg from '../../assets/work_time.svg';
import { useForm } from 'react-hook-form';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { noDragOrSelectCss } from '../utils';
import { useToasts } from 'react-toast-notifications';
import FullPageLoadSpinner from '../FullPageLoadSpinner';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectList = () => axios.get(projectsEndpoint, { withCredentials: true });
const requestProjectCreation = (values) => axios.post(projectsEndpoint, values, { withCredentials: true });

const ProjectCreationModalContext = React.createContext(null);

function ProjectCreationModalProvider({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, errors, register, formState } = useForm();
  const [projectsCreatedCount, setProjectsCreatedCount] = useState(0);
  const { addToast } = useToasts();

  const onSubmit = async (data) => {
    await requestProjectCreation({
      name: data.projectName,
    });

    addToast(`Has creado un nuevo proyecto llamado ${data.projectName}`, {
      appearance: 'success',
      autoDismiss: true,
    });

    setProjectsCreatedCount(projectsCreatedCount + 1);

    onClose();
  };

  return (
    <ProjectCreationModalContext.Provider
      value={{
        openProjectCreationModal: onOpen,
        closeProjectCreationModal: onClose,
        isProjectCreationModalOpen: isOpen,
        projectsCreatedCount,
      }}
    >
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un proyecto</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mt={4} isInvalid={errors.emailAddress}>
                <FormLabel htmlFor="emailAddress">Nombre del proyecto</FormLabel>
                <Input name="projectName" id="projectName" type="text" placeholder="Mi super proyecto" ref={register} />
                <FormErrorMessage>{errors.emailAddress && errors.emailAddress.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variantColor="blue" isLoading={formState.isSubmitting} type="submit">
                Crear proyecto <Icon ml={4} name="arrow-right" />
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {children}
    </ProjectCreationModalContext.Provider>
  );
}

function ProjectListPlaceholder() {
  const { openProjectCreationModal } = useContext(ProjectCreationModalContext);

  return (
    <Flex height="100%" width="100%" alignItems="center" justifyContent="center" textAlign="center" direction="column">
      <Image
        src={workTimeSvg}
        css={{
          ...noDragOrSelectCss,
        }}
        width="20rem"
      />

      <Heading as="h1" size="lg" color="blue.500" mt={8}>
        Todavía no eres miembro de un proyecto
      </Heading>

      <Heading as="h2" size="md" color="blue.500" mt={2}>
        ¡Crea uno o haz que te inviten!
      </Heading>

      <Button onClick={openProjectCreationModal} variantColor="blue" mt={4}>
        Crear un proyecto
      </Button>
    </Flex>
  );
}

function ProjectListContent({ projects }) {
  const { openProjectCreationModal } = useContext(ProjectCreationModalContext);
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" py={10} mx={8}>
      <Flex mb={12}>
        <Heading as="h1">Tus proyectos</Heading>
        <Button onClick={openProjectCreationModal} variantColor="blue" ml="auto">
          Crear un proyecto
        </Button>
      </Flex>
      <List>
        {projects.map((project) => (
          <ListItem key={project.id}>
            <Link to={`/project/${project.id}`}>
              <PseudoBox
                bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                shadow="md"
                p={6}
                mb={4}
                _hover={{
                  transform: 'scale(1.03)',
                }}
              >
                {project.name || 'Proyecto sin nombre'}
              </PseudoBox>
            </Link>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}

function ProjectListPage() {
  const [projects, setProjects] = useState(null);
  const { projectsCreatedCount } = useContext(ProjectCreationModalContext);

  useEffect(() => {
    requestProjectList().then((response) => {
      setProjects(response.data);
    });
  }, [projectsCreatedCount]);

  return (
    <MainLayout>
      {projects ? (
        projects.length > 0 ? (
          <ProjectListContent projects={projects} />
        ) : (
          <ProjectListPlaceholder />
        )
      ) : (
        <FullPageLoadSpinner message="Cargando los proyectos" />
      )}
    </MainLayout>
  );
}

const WrappedProjectListPage = () => (
  <ProjectCreationModalProvider>
    <ProjectListPage />
  </ProjectCreationModalProvider>
);
export default WrappedProjectListPage;
