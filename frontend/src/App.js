import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home, Login, Signup, Category, Cart, Admin } from './routes';
import { authUser, clearLocalUser, getLocalUser, setLocalUser } from './lib/auth';
import LogoutButton from './components/LogoutButton';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ loggedIn: false, userId: 0 });

  /**
   * In case of refresh, persists users login session
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
   * @param {number | string} userId - unique identifier (number) assigned to user
   * @returns {boolean}
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

  /**
   * callback arguments body runs on intitial component render
   * checks localStorage for user session
   */

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
          <LoadingSpinner />
        ) : (
          // We use a switch statement from react-router to simulate actual browser history
          // and so that the back button will work predictably.
          <Switch>
            {/* Home Page */}
            {/* Categories Page - List of items in specific category */}
            {/* Home Page */}
            <Route path="/categories/:id">
              <Category session={session} />
            </Route>
            <Route path="/categories">
              <Home />
            </Route>
            {/* Admin Page */}
            <Route path="/admin">
              <Admin />
            </Route>
            {/* Login Page for application/website */}
            <Route path="/login">
              <Login loginToApp={loginToApp} />
            </Route>
            {/* Sign up page for application/website */}
            <Route path="/signup">
              <Signup loginToApp={loginToApp} />
            </Route>
            {/* Page for Users Cart - Table that lists items in users cart */}
            <Route path="/mycart">
              <Cart session={session} />
            </Route>
            {/* Renders NoMatch Component for any route that doesn't match any of the above routes */}
            <Route exact path="/">
              <Home />
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

/**
 * If user is logged in, displays their user id. If not shows is not logged in center of nav bar
 */

function WelcomeMessage({ userId }) {
  if (userId) {
    return <Navbar.Text>{`User: ${userId}`}</Navbar.Text>;
  } else {
    return <Navbar.Text>{`Not logged in`}</Navbar.Text>;
  }
}

/**
 * If logged in, displays buttons MyCart and Logout.
 * else displays buttons Login and SignUp
 */

function UserOptions({ session, children }) {
  if (session.loggedIn) {
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

/**
 * gets location object from useLocation hook
 */

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
