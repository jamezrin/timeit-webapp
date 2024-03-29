import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import useResizeObserver from 'use-resize-observer';
import { useToasts } from 'react-toast-notifications';
import BaseTable, { Column } from 'react-base-table';
import 'react-base-table/styles.css';
import MainLayout from '../MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import useDocumentTitle from '../../hooks/documentTitleHook';
import useWindowDimensions from '../../hooks/windowDimensionsHook';
import {
  formatTitle,
  isResponseError,
  parseAndFormatTimestamp,
} from '../../utils';
import { RESOURCE_NOT_FOUND_ERROR } from '@timeit/error-types';
import {
  requestProjectInfo,
  requestSessionEvents,
  requestSessionInfo,
} from '../../api';

function ProjectSessionContent({ projectInfo, sessionInfo }) {
  const history = useHistory();
  const [sessionEvents, setSessionEvents] = useState([]);
  const { height } = useWindowDimensions();

  useEffect(() => {
    requestSessionEvents(sessionInfo.id).then((res) => {
      setSessionEvents(res.data);
    });
  }, [sessionInfo]);

  const { ref, width = 0 } = useResizeObserver();

  const data = useMemo(() => {
    if (!sessionEvents) return [];
    return sessionEvents.map((event) => {
      if (event.type === 'app_event') {
        return {
          id: event.id,
          keyType: 'App',
          keyTimes: event.data.eventCount,
          keyDate: parseAndFormatTimestamp(event.createdAt),
          keyContent: `${event.data.windowName} (${event.data.windowClass} ${event.data.windowPid})`,
        };
      } else if (event.type === 'note') {
        return {
          id: event.id,
          keyType: 'Nota',
          keyTimes: 1,
          keyDate: parseAndFormatTimestamp(event.createdAt),
          keyContent: event.data.text,
        };
      } else {
        return null;
      }
    });
  }, [sessionEvents]);

  return (
    <Flex direction="column" py={10} mx={8}>
      <Flex mb={12}>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="gray"
          variant="ghost"
          size="lg"
          whiteSpace="pre"
          onClick={() => history.push(`/project/${projectInfo.id}`)}
        >
          {projectInfo.name || 'Proyecto sin nombre'}
        </Button>
      </Flex>
      <Box ref={ref} flexGrow="1" mx={{ base: 0, lg: 8 }}>
        <Heading as="h2" size="lg" mb={3}>
          Lista de eventos
        </Heading>
        <BaseTable data={data} height={height - 300} width={width}>
          <Column
            key="keyType"
            dataKey="keyType"
            title="Tipo de evento"
            resizable={true}
            width={80}
          />
          <Column
            key="keyDate"
            dataKey="keyDate"
            title="Fecha de creación"
            resizable={true}
            width={200}
          />
          <Column
            key="keyTimes"
            dataKey="keyTimes"
            title="Ocurrencias"
            resizable={true}
            width={100}
          />
          <Column
            key="keyContent"
            dataKey="keyContent"
            title="Contenido"
            resizable={false}
            width={width - (80 + 200 + 100)}
          />
        </BaseTable>
      </Box>
    </Flex>
  );
}

function ProjectSessionPage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const { projectId, sessionId } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();

  useDocumentTitle(formatTitle('Lista de eventos'));

  useEffect(() => {
    Promise.all([
      requestProjectInfo(projectId).then((response) => {
        setProjectInfo(response.data);
      }),
      requestSessionInfo(sessionId).then((response) => {
        setSessionInfo(response.data);
      }),
    ]).catch((err) => {
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
  }, [history, addToast, projectId, sessionId]);

  return (
    <MainLayout>
      {projectInfo && sessionInfo ? (
        <ProjectSessionContent
          projectInfo={projectInfo}
          sessionInfo={sessionInfo}
        />
      ) : (
        <FullPageLoadSpinner message="Cargando la sesión seleccionada" />
      )}
    </MainLayout>
  );
}

export default ProjectSessionPage;
