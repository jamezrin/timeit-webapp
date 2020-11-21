import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { requestProjectCreation } from '../../api';

export const ProjectCreationModalContext = React.createContext(null);

const schema = yup.object().shape({
  projectName: yup.string().required().trim().min(4),
});

export function ProjectCreationModal({ isOpen, onClose, onSubmit }) {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const inputBg = useColorModeValue('white', 'gray.600');

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay zIndex="1000" />
      <ModalContent>
        <ModalHeader>Crear un proyecto</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mt={4} isInvalid={!!errors.projectName}>
              <FormLabel htmlFor="projectName">Nombre del proyecto</FormLabel>
              <Input
                name="projectName"
                id="projectName"
                type="text"
                placeholder="Mi super proyecto"
                ref={register}
                errorBorderColor="red.500"
                bg={inputBg}
              />
              <FormErrorMessage>
                {errors.projectName && errors.projectName.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Crear proyecto <ArrowRightIcon ml={4} />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export function ProjectCreationModalProvider({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [projectsCreatedCount, setProjectsCreatedCount] = useState(0);
  const { addToast } = useToasts();

  const makeRequest = async (data) => {
    await requestProjectCreation({
      name: data.projectName,
    });

    addToast(`Has creado un nuevo proyecto llamado ${data.projectName}`, {
      appearance: 'success',
      autoDismiss: true,
    });

    // This will cause an side effect we can use to reload the project list
    setProjectsCreatedCount(projectsCreatedCount + 1);

    // Close the modal
    if (isOpen) onClose();
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
      <ProjectCreationModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={makeRequest}
      />
      {children}
    </ProjectCreationModalContext.Provider>
  );
}
