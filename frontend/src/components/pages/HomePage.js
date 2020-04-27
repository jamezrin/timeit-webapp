import React from 'react';
import Header from '../Header';

import { Link as RouteLink } from 'react-router-dom';
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
  useDisclosure,
} from '@chakra-ui/core';

import workTimeSvg from '../../assets/work_time.svg';
import { useForm } from 'react-hook-form';

const noDragOrSelect = {
  userSelect: 'none',
  userDrag: 'none',
};

function EmptyHomePage() {
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

      <Flex
        maxWidth={{ base: '100%', lg: '80rem' }}
        marginX="auto"
        marginTop="4rem"
        height="100%"
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Image
          src={workTimeSvg}
          maxWidth="30rem"
          css={{
            ...noDragOrSelect,
          }}
        />

        <Heading as="h1" size="lg" color="blue.500" mt={8}>
          Todavía no eres miembro de ningún proyecto
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

function NotEmptyHomePage(props) {
  return (
    <Flex
      maxWidth={{ base: '100%', lg: '100rem' }}
      marginX="auto"
      marginTop="4rem"
      height="100%"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Image
        src={workTimeSvg}
        maxWidth="30rem"
        css={{
          ...noDragOrSelect,
        }}
      />

      <Heading as="h1" size="lg" color="blue.500" mt={8}>
        Todavía no eres miembro de ningún proyecto
      </Heading>

      <Heading as="h2" size="md" color="blue.500" mt={2}>
        ¡Crea uno o haz que te inviten!
      </Heading>

      <Button as={RouteLink} to="/create_project" variantColor="blue" mt={4}>
        Crear un proyecto
      </Button>
    </Flex>
  );
}

function HomePage(props) {
  const hasProjects = false;
  return (
    <Flex height="100vh" width="100vw" direction="column">
      <Header />
      {hasProjects ? <NotEmptyHomePage /> : <EmptyHomePage />}
    </Flex>
  );
}

export default HomePage;
