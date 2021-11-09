import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../lib/axios';

export default function Category(props) {
  // defined initial useState
  // useState return a variable, and setter or function that changes the viarable
  const [items, setItems] = useState([]);

  const { id } = useParams();
  const history = useHistory();

  // used useEffect to make request to items API from /items
  useEffect(async () => {
    const response = await axios.get('/items');
    const cat1 = response.data
      .filter((item) => item.CategoryId === Number(id))
      .map((item) => {
        return { ...item, isInCart: false };
      });
    setItems(cat1);
  }, []);

  const redirectTo = (path) => {
    history.push(path);
  };

  const updateAddToCartButton = (item) => {
    const updatedItems = items.map((itemObjs) => {
      if (itemObjs.id === item.id) return Object.assign({}, { ...item, isInCart: true });
      return itemObjs;
    });
    setItems(updatedItems);
  };

  const queryCartItemApi = async (userId, item) => {
    const getCartItem = await axios.get(`/cartItems/${item.id}`);
    const data = getCartItem.data;
    if (!Object.values(data).length) {
      return await axios.post('/cartItems', { id: item.id, quantity: 1, CartId: userId });
    }
  };

  const addToCart = async (item) => {
    const { loggedIn, userId } = props.session;

    if (!loggedIn) redirectTo('/login');

    // disables add to cart button and changes button text to inCart
    updateAddToCartButton(item);

    const cartItem = await queryCartItemApi(userId, item);
  };

  const selectTitle = () => {
    switch (id) {
      case '1':
        return 'Jewelery Collection';
      case '2':
        return 'Electronics Collection';
      case '3':
        return "Women's Clothing";
      case '4':
        return "Men's Clothing";
    }
  };

  // returned dummy element with loading as text while the request is made
  if (items.length === 0) {
    return <h1>loading</h1>;
  }

  // return list of items in inside of JSX (html) for showing on the browser
  return (
    <Container className="my-4">
      <h2 className="display-3 my-2">{selectTitle()}</h2>
      <Row xs={1} md={4} className="g-4 pt-3 justify-content-center">
        {/* map over the items data pass it into item card */}
        {items.map((item) => {
          return <ItemCard key={item.id} item={item} handleClick={addToCart}></ItemCard>;
        })}
      </Row>
    </Container>
  );
}

function ItemCard(props) {
  return (
    <Col className="align-self-strech">
      <Card className="h-100">
        <Card.Img
          variant="top"
          style={{ width: '100%', height: '100%', maxHeight: '300px' }}
          className=" img-thumbnail ratio ratio-4x3"
          src={props.item.imageLink}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <hr />
          <Card.Title>{props.item.name}</Card.Title>
          <hr />
          <Card.Text className="text-start">{props.item.description}</Card.Text>
          <Card.Text>£{props.item.price}</Card.Text>
          <Button disabled={props.item.isInCart} onClick={() => props.handleClick(props.item)} variant="primary">
            {props.item.isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
