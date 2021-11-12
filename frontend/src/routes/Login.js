import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';

/**
 * Login component
 * shows login form.
 * on submission with valid input, redirects
 * user to home page; otherwise displays
 * modal promting user to enter valid (existant) userId
 */

export function Login({ loginToApp }) {
  const history = useHistory();
  const [userId, setUserId] = useState(null);
  // Modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Logic
  const handleIdChange = (event) => {
    setUserId(event.target.value);
  };

  /**
   * Logs user into application on login form submit; if entry exists
   * otherwise triggers modal to show up prompting user to enter valid
   * input
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loggedIn = await loginToApp(userId);

    if (loggedIn) {
      history.push('/');
    } else {
      handleShow();
    }
  };

  return (
    <>
      <Container className="my-auto">
        <Form>
          <Form.Group className="mb-3" controlId="formUserId">
            <Form.Label>User ID</Form.Label>
            <Form.Control placeholder="Enter User ID" onChange={handleIdChange} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </Form>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Incorrect User ID</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please enter valid User ID</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
