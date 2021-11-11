import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar, Container, Nav, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home, Login, Signup, Category, Cart, Admin } from './routes';
import { authUser, clearLocalUser, getLocalUser, setLocalUser } from './lib/auth';
import LogoutButton from './components/LogoutButton';

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ loggedIn: false, userId: 0 });

  /**
   * In case of refresh, persists users login session and their cart
   */

  const loginLocalToApp = async () => {
    setLoading(true);
    const userId = getLocalUser();
    const thisSession = await loginToApp(userId);
    setLoading(false);
    return thisSession;
  };

  /**
   *
   * @param {*} userId - unique identifier (number) assigned to user
   * @returns true if identifier exists in db; otherwise returns false
   */

  const loginToApp = async (userId) => {
    const authorised = await authUser(userId);

    if (authorised) {
      setLocalUser(userId);
      setSession({ loggedIn: true, userId: authorised.id });
      return true;
    } else {
      return false;
    }
  };

  /**
   * Logs user out of application.
   * clears userId (which is a cartId) from localStorage
   */

  const logoutOfApp = async () => {
    setSession({ loggedIn: false, userId: 0 });
    clearLocalUser();
  };

  useEffect(async () => {
    await loginLocalToApp();
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>Home</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto"></Nav>
            <Nav className="me-auto">
              <WelcomeMessage userId={session.userId} />
            </Nav>
            <Nav>
              <UserOptions session={session}>
                <LogoutButton logout={logoutOfApp} />
              </UserOptions>
            </Nav>
          </Container>
        </Navbar>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/categories/:id">
              <Category session={session} />
            </Route>
            <Route exact path="/categories">
              <Home />
            </Route>
            {/* <Route path="/carts">
            <Cart />
          </Route> */}
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/login">
              <Login loginToApp={loginToApp} />
            </Route>
            <Route path="/signup">
              <Signup loginToApp={loginToApp} />
            </Route>
            <Route path="/mycart">
              <Cart session={session} />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

function WelcomeMessage({ userId }) {
  if (userId) {
    return <Navbar.Text>{`User: ${userId}`}</Navbar.Text>;
  } else {
    return <Navbar.Text>{`Not logged in`}</Navbar.Text>;
  }
}

function UserOptions({ session, children }) {
  if (session.loggedIn === true) {
    return (
      <>
        <LinkContainer to="/mycart" className="mx-2">
          <Button>My Cart</Button>
        </LinkContainer>
        {/* Render any child components */}
        {children}
      </>
    );
  } else {
    return (
      <>
        <LinkContainer to="/login" className="mx-2">
          <Button>Login</Button>
        </LinkContainer>
        <LinkContainer to="/signup" className="mx-2">
          <Button>Sign up</Button>
        </LinkContainer>
      </>
    );
  }
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default App;
