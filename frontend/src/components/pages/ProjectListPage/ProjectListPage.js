import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  PseudoBox,
  useColorMode,
} from '@chakra-ui/core';

import workTimeSvg from '../../../assets/work_time.svg';
import MainLayout from '../../base/MainLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatTitle, noDragOrSelectCss } from '../../../utils';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import {
  ProjectCreationModalContext,
  ProjectCreationModalProvider,
} from './ProjectCreationModal';
import useDocumentTitle from '@rehooks/document-title';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectList = () => axios.get(
  projectsEndpoint,
  { withCredentials: true },
); // prettier-ignore

function ProjectListPlaceholder() {
  const { openProjectCreationModal } = useContext(ProjectCreationModalContext);

  return (
    <Flex
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      direction="column"
    >
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
    <Box py={10} mx={8}>
      <Flex>
        <Heading as="h1">Tus proyectos</Heading>
        <Button
          onClick={openProjectCreationModal}
          variantColor="blue"
          ml="auto"
        >
          Crear un proyecto
        </Button>
      </Flex>
      <List mt={12}>
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
    </Box>
  );
}

function ProjectListPage() {
  const [projects, setProjects] = useState(null);
  const { projectsCreatedCount } = useContext(ProjectCreationModalContext);
  useDocumentTitle(formatTitle('Lista de proyectos'));

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
