import React, { useCallback, useEffect, useMemo } from 'react';
import { useColorMode, useTheme } from '@chakra-ui/core';
import { isMemberPrivileged } from '../../../utils';
import Select from 'react-select';

function SelectProjectMember({
  projectInfo,
  projectMembers,
  onSelectedMemberChange: _onSelectedMemberChange,
}) {
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

  const onSelectedMemberChange = useCallback(_onSelectedMemberChange, []);

  useEffect(() => {
    if (defaultProjectMember) {
      onSelectedMemberChange([defaultProjectMember.value]);
    } else {
      onSelectedMemberChange([]);
    }
  }, [onSelectedMemberChange, defaultProjectMember]);

  const handleSelectChange = useCallback(
    (selectedProjectMembers) => {
      if (selectedProjectMembers) {
        onSelectedMemberChange(
          selectedProjectMembers.map(
            (selectedProjectMember) => selectedProjectMember.value,
          ),
        );
      } else {
        onSelectedMemberChange([]);
      }
    },
    [onSelectedMemberChange],
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
    projectMemberOptions && (
      <Select
        defaultValue={[defaultProjectMember]}
        options={projectMemberOptions}
        onChange={handleSelectChange}
        styles={selectStyles}
        isMulti
      />
    )
  );
}

export default SelectProjectMember;
