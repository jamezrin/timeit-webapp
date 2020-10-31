import moment from "moment";

export const noDragOrSelectCss = {
  userSelect: "none",
  userDrag: "none",
  pointerEvents: "none"
};

// Only ADMIN and EMPLOYER roles can see entities of other project members
// TODO: Use the same function and type as the backend, share a portion of the code
export const isMemberPrivileged = (projectMember) =>
  projectMember.role === "admin" || projectMember.role === "manager";

export const parseAndFormatTimestamp = (dateString) =>
  moment(dateString).format("HH:mm:ss DD/MM/YYYY");

export const parseAndFormatDate = (dateString) =>
  moment(dateString).format("DD/MM/YYYY");

export const findProjectMember = (projectMembers, memberId) =>
  projectMembers.find((member) => member.id === memberId);

export const formatUserFullName = (user) =>
  `${user.firstName} ${user.lastName}`;

export const formatMinutes = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  return Math.floor(minutes / 60) + "h"
    + Math.floor(minutes % 60) + "m"; // prettier-ignore
};

export const formatTitle = (title) => `${title} - TimeIt`;
