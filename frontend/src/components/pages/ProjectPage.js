import React from 'react';

function ProjectPage(props) {
  return (
    <div>
      Hola mundo! project: {props.match.params.projectId}
      <div> {JSON.stringify(props)}</div>
    </div>
  );
}

export default ProjectPage;
