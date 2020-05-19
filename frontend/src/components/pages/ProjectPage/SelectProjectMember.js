import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, useColorMode, useTheme } from '@chakra-ui/core';
import { isMemberPrivileged } from '../../../utils';
import Select from 'react-select';
import axios from 'axios';

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectMembers = (projectId) => axios.get(`${projectsEndpoint}/${projectId}/members`, { withCredentials: true }); // prettier-ignore

function SelectProjectMember({ projectInfo, updateSelectedProjectMembers }) {
  const [projectMembers, setProjectMembers] = useState(null);
  const { colorMode } = useColorMode();
  const chakraTheme = useTheme();

  const projectMemberOptions = useMemo(() => {
    if (!projectMembers) return null;
    return projectMembers
      .filter((projectMember) => {
        // If we are ourselves, we obviously have access to our own metrics
        // If we are admins or employers, we have access to the metrics of everyone
        return projectMember.id === projectInfo.projectMember.id ||
          isMemberPrivileged(projectInfo.projectMember); // prettier-ignore
      })
      .map((projectMember) => {
        return {
          label: `${projectMember.user.firstName} ${projectMember.user.lastName}`,
          value: projectMember.id,
        };
      });
  }, [projectInfo, projectMembers]);

  const defaultProjectMember = useMemo(() => {
    if (!projectMemberOptions) return null;
    return projectMemberOptions.find((option) => {
      return option.value === projectInfo.projectMember.id;
    });
  }, [projectMemberOptions, projectInfo]);

  useEffect(() => {
    requestProjectMembers(projectInfo.id).then((res) => {
      setProjectMembers(res.data);
    });
  }, [projectInfo]);

  useEffect(() => {
    if (defaultProjectMember) {
      updateSelectedProjectMembers([defaultProjectMember]);
    } else {
      updateSelectedProjectMembers(null);
    }
  }, [updateSelectedProjectMembers, defaultProjectMember]);

  const handleSelectChange = useCallback(
    (data) => {
      if (!data || data.length === 0) {
        updateSelectedProjectMembers(null);
      } else {
        updateSelectedProjectMembers(data);
      }
    },
    [updateSelectedProjectMembers],
  );

  const selectStyles = useMemo(() => {
    return {
      control: (styles) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
          backgroundColor: chakraTheme.colors.gray['900'],
          borderColor: chakraTheme.colors.gray['700'],
          ':hover': {
            ...styles[':hover'],
            borderColor: chakraTheme.colors.gray['900'],
          },
        };
      },
      menu: (styles, state) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
          backgroundColor: chakraTheme.colors.gray['900'],
        };
      },
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
          backgroundColor: chakraTheme.colors.gray['900'],
          ':active': {
            backgroundColor: chakraTheme.colors.gray['700'],
          },
        };
      },
      multiValue: (styles, { data }) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
        };
      },
      multiValueLabel: (styles, { data }) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
        };
      },
      multiValueRemove: (styles, { data, theme }) => {
        if (colorMode !== 'dark') {
          return styles;
        }

        return {
          ...styles,
          color: chakraTheme.colors.gray['800'],
        };
      },
    };
  }, [chakraTheme, colorMode]);

  return (
    <Box maxWidth="20rem">
      {projectMemberOptions && (
        <>
          <Select
            defaultValue={[defaultProjectMember]}
            options={projectMemberOptions}
            onChange={handleSelectChange}
            styles={selectStyles}
            isMulti
          />
        </>
      )}
    </Box>
  );
}

export default SelectProjectMember;
