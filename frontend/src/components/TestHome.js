import React, {Component, useState} from 'react';

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

import DatePicker from "react-datepicker";
import DatePicker2 from "react-date-picker";
import {SingleDatePicker} from "react-dates";
import 'react-dates/initialize';

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

class TestAirbnb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            date: new Date()
        }
    }

    render() {
        return (
            <SingleDatePicker
                date={this.state.date} // momentPropTypes.momentObj or null
                onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                focused={this.state.focused} // PropTypes.bool
                onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired,
            />
        );
    }
}

export default function TestHome() {
  return (
    <div>
      <Example/>
      <DatePicker/>
      <DatePicker2 onFo/>
      <TestAirbnb/>
    </div>
  );
}
