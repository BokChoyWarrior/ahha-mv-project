import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar, Container, Nav, Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home, Login, Signup, Category } from './routes';
import { authUser, clearLocalUser, getLocalUser } from './lib/auth';
import LogoutButton from './components/LogoutButton';

function App() {
  const [session, setSession] = useState({ loggedIn: false, userId: 0 });

  const loginLocalToApp = async () => {
    const userId = getLocalUser();
    return await loginToApp(userId);
  };

  const loginToApp = async (userId) => {
    const authorised = await authUser(userId);

    if (authorised) {
      setSession({ loggedIn: true, userId: authorised.id });
      return true;
    } else {
      return false;
    }
  };

  const logoutOfApp = async () => {
    setSession({ loggedIn: false, userId: 0 });
    clearLocalUser();
  };

  useEffect(() => {
    loginLocalToApp();
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
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/categories/:id">
            <Category />
          </Route>
          <Route exact path="/categories">
            <Home />
          </Route>
          {/* <Route path="/carts">
            <Cart />
          </Route> */}
          <Route path="/login">
            <Login loginToApp={loginToApp} />
          </Route>
          <Route path="/signup">
            <Signup loginToApp={loginToApp} />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
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
