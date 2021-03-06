import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

/**
 * Logs out the user and then redirects to home
 * @param {Object} should be given a logout function fromthe App to handle session
 */
export default function LogoutButton({ logout }) {
  const history = useHistory();

  const handleClick = () => {
    logout();
    history.push('/');
  };

  return (
    <>
      <Button variant="outline-danger" onClick={handleClick} className="mx-2">
        Logout
      </Button>
    </>
  );
}
