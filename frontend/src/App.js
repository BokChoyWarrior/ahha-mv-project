import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import {} from './routes';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Categories, Home, Category } from './routes';

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
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          {/* <Route path="/categories/:id">
            <Category />
          </Route> */}
          <Route exact path="/categories">
            <Home />
          </Route>
          <Route exact path="/categories/:categoryId">
            <Category />
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
