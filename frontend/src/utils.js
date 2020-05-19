export const noDragOrSelectCss = {
  userSelect: 'none',
  userDrag: 'none',
  pointerEvents: 'none',
};

// Only ADMIN and EMPLOYER roles can see entities of other project members
// TODO: Use the same function and type as the backend, share a portion of the code
export const isMemberPrivileged = (projectMember) =>
  projectMember.role === 'admin' || projectMember.role === 'employer';
