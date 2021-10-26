import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_URL;

const performPasswordResetEndpoint = backendBaseUrl + `/perform-password-reset`;
const confirmAccountEndpoint = backendBaseUrl + `/confirm-account`;
const currentUserEndpoint = backendBaseUrl + '/current-user';
const authenticateEndpoint = backendBaseUrl + '/authenticate';
const deauthenticateEndpoint = backendBaseUrl + '/deauthenticate';
const projectMembersEndpoint = backendBaseUrl + '/project_members';
const projectStatisticsEndpoint =
  backendBaseUrl + '/data_query/summary_statistics';
const projectStatisticsHistoryEndpoint =
  backendBaseUrl + '/data_query/history_statistics';
const sessionsEndpoint = backendBaseUrl + '/sessions';
const sessionEventEndpoint = backendBaseUrl + '/data_query/session_events';
const projectsEndpoint = backendBaseUrl + '/projects';
const requestPasswordEndpoint = backendBaseUrl + '/request-password-reset';
const createAccountEndpoint = backendBaseUrl + '/create-account';

export function requestAcceptProjectInvite(projectId, token) {
  return axios.post(
    `${projectsEndpoint}/${projectId}/accept-invite/${token}`,
    {},
    { withCredentials: true },
  );
}

export function requestConfirmAccount(token) {
  return axios.post(
    `${confirmAccountEndpoint}/${token}`,
    {},
    { withCredentials: true },
  );
}

export function requestProjectSessions(
  projectId,
  startDate,
  endDate,
  memberIds = [],
) {
  return axios.get(`${projectsEndpoint}/${projectId}/sessions`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });
}

export function requestProjectStatistics(
  projectId,
  startDate,
  endDate,
  memberIds = [],
) {
  return axios.get(`${projectStatisticsEndpoint}/${projectId}`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });
}

export function requestProjectHistory(projectId, startDate, endDate, memberId) {
  return axios.get(`${projectStatisticsHistoryEndpoint}/${projectId}`, {
    withCredentials: true,
    params: {
      memberId,
      startDate,
      endDate,
    },
  });
}

export function requestProjectRename(projectId, name) {
  return axios.patch(
    `${projectsEndpoint}/${projectId}`,
    { name },
    { withCredentials: true },
  );
}

export function requestProjectInvite(projectId, emailAddress) {
  return axios.post(
    `${projectsEndpoint}/${projectId}/invite`,
    { emailAddress },
    { withCredentials: true },
  );
}

export function requestMemberKick(memberId) {
  return axios.post(
    `${projectMembersEndpoint}/${memberId}/kick`,
    {},
    { withCredentials: true },
  );
}

export function requestMemberPromote(memberId) {
  return axios.post(
    `${projectMembersEndpoint}/${memberId}/promote`,
    {},
    { withCredentials: true },
  );
}

export function requestMemberDemote(memberId) {
  return axios.post(
    `${projectMembersEndpoint}/${memberId}/demote`,
    {},
    { withCredentials: true },
  );
}

export function requestProjectMembers(projectId) {
  return axios.get(`${projectsEndpoint}/${projectId}/members`, {
    withCredentials: true,
  });
}

export function requestProjectInfo(projectId) {
  return axios.get(`${projectsEndpoint}/${projectId}`, {
    withCredentials: true,
  });
}

export function requestSessionInfo(sessionId) {
  return axios.get(`${sessionsEndpoint}/${sessionId}`, {
    withCredentials: true,
  });
}

export function requestSessionEvents(sessionId) {
  return axios.get(`${sessionEventEndpoint}/${sessionId}`, {
    withCredentials: true,
  });
}

export function requestProjectDelete(projectId) {
  return axios.delete(`${projectsEndpoint}/${projectId}`, {
    withCredentials: true,
  });
}

export function performPasswordReset(values, token) {
  return axios.post(`${performPasswordResetEndpoint}/${token}`, values, {
    withCredentials: true,
  });
}

export function requestPasswordReset(values) {
  return axios.post(requestPasswordEndpoint, values, { withCredentials: true });
}

export function requestAccountCreation(values) {
  return axios.post(createAccountEndpoint, values, { withCredentials: true });
}

export function requestProjectCreation(values) {
  return axios.post(projectsEndpoint, values, { withCredentials: true });
}

export function requestProjectList() {
  return axios.get(projectsEndpoint, { withCredentials: true });
}

export function requestCurrentUser() {
  return axios.get(currentUserEndpoint, { withCredentials: true });
}

export function requestAuthentication(values) {
  return axios.post(authenticateEndpoint, values, { withCredentials: true });
}

export function requestDeauthentication() {
  return axios.post(deauthenticateEndpoint, {}, { withCredentials: true });
}
