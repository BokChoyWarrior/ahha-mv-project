import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import {} from './routes';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Home } from './routes';
import { authUser } from './lib/auth';

function App() {
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
            <UserOptions />
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
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function UserOptions() {
  const [user, setUser] = useState(false);

  const getCurrentUser = async () => {
    try {
      setUser(localStorage.getItem('User'));
    } catch (e) {
      console.log(e);
    }

    // If there's a user set in localStorage, we should make sure the cart also exists!
    if (user) {
      const cart = await authUser(user);
      if (cart) {
        setUser(cart.id);
      }
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (user) {
    return (
      <>UserExists</>
      // <MyCart />
      // <LogoutButton />
    );
  } else {
    return (
      <>Not exists</>
      // <LoginButton />
      // <SignupButton />
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
