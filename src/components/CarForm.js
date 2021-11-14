import React from "react";
import { Form, Input, Button, InputGroupText, InputGroup } from "reactstrap";

const CarForm = () => {
  return (
    <Form>
      <InputGroup>
        <InputGroupText for="year">Year</InputGroupText>
        <Input
          id="year"
          name="year"
          placeholder="1996"
          type="number"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="color">Color</InputGroupText>
        <Input
          id="color"
          name="color"
          placeholder="Black"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="make">Make</InputGroupText>
        <Input
          id="make"
          name="make"
          placeholder="Honda"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="model">Model</InputGroupText>
        <Input
          id="model"
          name="model"
          placeholder="Accord"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="startDate">Start Date</InputGroupText>
        <Input id="startDate" name="startDate" type="date" autoComplete="off" />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="startOdo">Starting ODO</InputGroupText>
        <Input
          id="startOdo"
          name="startOdo"
          placeholder="0"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <Button color="warning">Create New Car</Button>
    </Form>
  );
};

export default CarForm;
