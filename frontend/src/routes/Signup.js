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

  /**
   * controls what happends when signup form submission happens
   * prevents default browser behaviour
   * makes a request to cart API endpoint to create a new cart entry in Carts table
   * sets cartId which will be the usersId to component state
   * triggers modal to open which will display the users assigned cartId/userId
   */

  // creates cart/user -> saves in local storage -> displays modal with user/cart id for logging in
  const handleSubmit = async (event) => {
    event.preventDefault();
    const cart = await axios.post('/carts');
    setUserId(cart.data.id);
    setLocalUser(userId);
    handleShow();
  };

  /**
   * logs user in when they sign up
   * redirects user to homepage on if login attempt successful
   */

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
