import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../base/MainLayout";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import FullPageLoadSpinner from "../../base/FullPageLoadSpinner";

import BaseTable, { Column } from "react-base-table";
import "react-base-table/styles.css";

import useWindowDimensions from "../../../hooks/windowDimensionsHook";
import { formatTitle, parseAndFormatTimestamp } from "../../../utils";
import useResizeObserver from "use-resize-observer";
import useDocumentTitle from "@rehooks/document-title";
import { useToasts } from "react-toast-notifications";

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + "/projects"; // prettier-ignore
const sessionsEndpoint = process.env.REACT_APP_BACKEND_URL + "/sessions"; // prettier-ignore
const sessionEventEndpoint = process.env.REACT_APP_BACKEND_URL + "/data_query/session_events"; // prettier-ignore

const requestProjectInfo = (projectId) => axios.get(
  `${projectsEndpoint}/${projectId}`,
  { withCredentials: true }
); // prettier-ignore

const requestSessionInfo = (sessionId) => axios.get(
  `${sessionsEndpoint}/${sessionId}`,
  { withCredentials: true }
); // prettier-ignore

const requestSessionEvents = (sessionId) => axios.get(
  `${sessionEventEndpoint}/${sessionId}`,
  { withCredentials: true }
); // prettier-ignore

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
      if (event.type === "app_event") {
        return {
          id: event.id,
          keyType: "App",
          keyTimes: event.data.eventCount,
          keyDate: parseAndFormatTimestamp(event.createdAt),
          keyContent: `${event.data.windowName} (${event.data.windowClass} ${event.data.windowPid})`
        };
      } else if (event.type === "note") {
        return {
          id: event.id,
          keyType: "Nota",
          keyTimes: 1,
          keyDate: parseAndFormatTimestamp(event.createdAt),
          keyContent: event.data.text
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
          leftIcon="arrow-back"
          variantColor="gray"
          variant="ghost"
          size="lg"
          whiteSpace="pre"
          onClick={() => history.push(`/project/${projectInfo.id}`)}
        >
          {projectInfo.name || "Proyecto sin nombre"}
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

  useDocumentTitle(formatTitle("Lista de eventos"));

  useEffect(() => {
    Promise.all([
      requestProjectInfo(projectId).then((response) => {
        setProjectInfo(response.data);
      }),
      requestSessionInfo(sessionId).then((response) => {
        setSessionInfo(response.data);
      })
    ]).catch((err) => {
      if (err.response && err.response.data.error) {
        if (err.response.data.error.type === "RESOURCE_NOT_FOUND") {
          addToast(`No se ha podido encontrar la sesión que has pedido`, {
            appearance: "error",
            autoDismiss: true
          });

          history.push("/");
        }
      } else {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: "error",
          autoDismiss: true
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
