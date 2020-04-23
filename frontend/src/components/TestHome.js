import React, { Component, useState } from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
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
