import React, { useEffect, useState } from 'react';
import Header from '../Header';
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Stack,
  Box,
  useDisclosure,
} from '@chakra-ui/core';

import workTimeSvg from '../../assets/work_time.svg';
import { useForm } from 'react-hook-form';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';

const noDragOrSelect = {
  userSelect: 'none',
  userDrag: 'none',
  pointerEvents: 'none',
};

const listProjectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectList = () => axios.get(listProjectsEndpoint, { withCredentials: true });

function ProjectListPlaceholder() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, errors, register, formState } = useForm();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2300));
    onClose();
    console.log(data);
  };

  return (
    <>
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

      <Flex height="100%" alignItems="center" justifyContent="center" textAlign="center" direction="column">
        <Image
          src={workTimeSvg}
          css={{
            ...noDragOrSelect,
          }}
          width="20rem"
        />

        <Heading as="h1" size="lg" color="blue.500" mt={8}>
          Todavía no eres miembro de un proyecto
        </Heading>

        <Heading as="h2" size="md" color="blue.500" mt={2}>
          ¡Crea uno o haz que te inviten!
        </Heading>

        <Button onClick={onOpen} variantColor="blue" mt={4}>
          Crear un proyecto
        </Button>
      </Flex>
    </>
  );
}

function ProjectListContent({ projects }) {
  return (
    <Box marginTop="4rem">
      <Heading as="h1" mb={10}>
        Tus proyectos
      </Heading>
      {projects.map((project) => (
        <Link
          to={{
            pathname: `/project/${project.id}`,
          }}
        >
          <Text bg="red.500" p={6} mb={2}>
            {JSON.stringify(project)}
          </Text>
        </Link>
      ))}
    </Box>
  );
}

function ProjectListWrapper({ children }) {
  return children;
}

function ProjectListPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    requestProjectList().then((response) => {
      setProjects(response.data);
    });
  }, []);

  return (
    <MainLayout>
      <Box maxWidth={{ base: '100%', lg: '100rem' }} marginX="auto" height="100%">
        <ProjectListWrapper>
          {projects.length > 0 ? <ProjectListContent projects={projects} /> : <ProjectListPlaceholder />}
        </ProjectListWrapper>
      </Box>
    </MainLayout>
  );
}

export default ProjectListPage;
