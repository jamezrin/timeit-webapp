import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import MainLayout from '../MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { formatTitle, noDragOrSelectCss } from '../../utils';
import workTimeSvg from '../../assets/work_time.svg';
import useDocumentTitle from '../../hooks/documentTitleHook';
import {
  ProjectCreationModalContext,
  ProjectCreationModalProvider,
} from './ProjectCreationModal';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectList = () => axios.get(
  projectsEndpoint,
  { withCredentials: true }
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

      <Button onClick={openProjectCreationModal} colorScheme="blue" mt={4}>
        Crear un proyecto
      </Button>
    </Flex>
  );
}

function ProjectListContent({ projects }) {
  const { openProjectCreationModal } = useContext(ProjectCreationModalContext);
  const projectBoxBg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box py={10} mx={8}>
      <Flex>
        <Heading as="h1">Tus proyectos</Heading>
        <Button onClick={openProjectCreationModal} colorScheme="blue" ml="auto">
          Crear un proyecto
        </Button>
      </Flex>
      <List mt={12}>
        {projects.map((project) => (
          <ListItem key={project.id}>
            <Link to={`/project/${project.id}`}>
              <Box
                bg={projectBoxBg}
                shadow="md"
                p={6}
                mb={4}
                _hover={{
                  transform: 'scale(1.03)',
                }}
              >
                {project.name || 'Proyecto sin nombre'}
              </Box>
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
