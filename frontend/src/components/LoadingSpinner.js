import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

export default function LoadingSpinner() {
  return (
    <Container
      className="justify-content-center align-items-center"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}
