import React from 'react';
import { Flex, Heading, Image } from '@chakra-ui/react';
import analyticsSvg from '../../assets/setup_analytics.svg';
import { noDragOrSelectCss } from '../../utils';

export default function ProjectPageNoInfo() {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      maxWidth="1200px"
      m="auto"
    >
      <Image
        src={analyticsSvg}
        maxWidth="36rem"
        alt=""
        mt="8rem"
        css={{
          ...noDragOrSelectCss,
        }}
      />
      <Heading
        as="h2"
        mt={10}
        maxWidth="50%"
        fontSize="2xl"
        color="blue.400"
        textAlign="center"
      >
        Selecciona un miembro de tu grupo para ver estadísticas y información
        sobre las sesiones de trabajo realizadas dentro de este proyecto
      </Heading>
    </Flex>
  );
}
