import React from 'react';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/core';

function TestDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button variantColor="purple" onClick={onOpen}>
        Open Drawer
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
          <DrawerFooter>dadsa</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default function TestHome() {
  return (
    <>
      <TestDrawer />
    </>
  );
}
