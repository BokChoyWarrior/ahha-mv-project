import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { setLocalUser } from '../lib/auth';
import axios from '../lib/axios';
import { useHistory } from 'react-router';

export function Signup({ loginToApp }) {
  const history = useHistory();
  const [userId, setUserId] = useState(null);

  //modal
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cart = await axios.post('/carts');
    setUserId(cart.data.id);
    setLocalUser(userId);
    handleShow();
  };

  const handleHomepage = async () => {
    const loggedIn = await loginToApp(userId);

    if (loggedIn) {
      history.push('/');
    }
  };

  return (
    <>
      <Container className="my-auto">
        <Form>
          <Form.Group className="mb-3" controlId="formUserId">
            <Form.Label>Name</Form.Label>
            <Form.Control placeholder="Enter your name" />
            <Form.Text className="text-muted">Please enter a valid name</Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Sign Up
          </Button>
        </Form>
        <Modal show={show}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome user {userId}!</Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHomepage}>Go to Homepage</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
