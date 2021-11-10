import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { saveUserToLocal, verifyLocalUser } from '../lib/auth';
import { useHistory } from 'react-router';

export function Login({loginToApp}) {
  const history = useHistory()
  const [userId, setUserId] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    saveUserToLocal(userId);

    const loggedIn = await loginToApp()

    if (loggedIn) {
      history.push('/')
    } else {
      handleShow()
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
