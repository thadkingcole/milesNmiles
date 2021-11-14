import React from "react";
import { Form, Input, Button, InputGroupText, InputGroup } from "reactstrap";

const TripForm = () => {
  return (
    <Form>
      {/* TODO add drop down for user's cars */}
      <InputGroup>
        <InputGroupText for="date">Date</InputGroupText>
        <Input id="date" name="date" type="date" autoComplete="off" />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="odoMiles">ODO</InputGroupText>
        <Input
          id="odoMiles"
          name="odoMiles"
          placeholder="0"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="gallons">Gallons</InputGroupText>
        <Input
          id="gallons"
          name="gallons"
          placeholder="10"
          type="text"
          autoComplete="off"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText for="comments">Comments</InputGroupText>
        <Input
          id="comments"
          name="comments"
          placeholder="optional"
          type="textarea"
          autoComplete="off"
        />
      </InputGroup>
      <Button color="success">Add Trip</Button>
    </Form>
  );
};

export default TripForm;
