import moment from 'moment';

export const noDragOrSelectCss = {
  userSelect: 'none',
  userDrag: 'none',
  pointerEvents: 'none',
};

// Only ADMIN and EMPLOYER roles can see entities of other project members
// TODO: Use the same function and type as the backend, share a portion of the code
export const isMemberPrivileged = (projectMember) =>
  projectMember.role === 'admin' || projectMember.role === 'employer';

export const parseAndFormatDate = (dateString) =>
  moment(dateString).format('HH:mm:ss DD/MM/YYYY');
