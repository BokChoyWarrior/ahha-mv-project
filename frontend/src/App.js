import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import './App.css';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home, Login, Signup } from './routes';
import { authUser, verifyLocalUser } from './lib/auth';

function App() {
  const [session, setSession] = useState({ loggedIn: false, userId: 0 });

  const loginToApp = async () => {
    const authorised = await verifyLocalUser();

    if (authorised) {
      setSession({ loggedIn: true, userId: authorised.id });
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>Home</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <LinkContainer to="/categories">
                <Nav.Link>Categories</Nav.Link>
              </LinkContainer>
            </Nav>
            <UserOptions session={session} />
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          {/* <Route path="/categories/:id">
            <Category />
          </Route> */}
          <Route path="/categories">
            <Home />
          </Route>
          {/* <Route path="/cart">
            <Cart />
          </Route> */}
          <Route path="/login">
            <Login loginToApp={loginToApp} />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function UserOptions({session}) {

  if (session.loggedIn === true) {
    return (
      <>
        <h4>Hello, {session.userId}</h4>
        <LinkContainer to="/mycart">
          <Button>My Cart</Button>
        </LinkContainer>
        <LinkContainer to="/logout">
          <Button>Log Out</Button>
        </LinkContainer>
      </>
    );
  } else {
    return (
      <>
        <LinkContainer to="/login">
          <Button>Login</Button>
        </LinkContainer>
        <LinkContainer to="/signup">
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
