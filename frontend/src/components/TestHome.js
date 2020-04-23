import React from 'react';

import {Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/core";

function Example() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
      <div>
        <Button variaNtCOlor="green" onClick={onOpen}>Open Drawer</Button>
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
            <DrawerBody>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
  );
}

export default function TestHome() {
  return (
    <div>
      <Example/>
    </div>
  );
}
