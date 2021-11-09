import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../lib/axios';

export default function Category(props) {
  // defined initial useState
  // useState return a variable, and setter or function that changes the viarable
  const { id } = useParams();
  const history = useHistory();

  const [items, setItems] = useState([]);
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

  const getUserId = () => {
    return props.userId;
  };

  const redirectTo = (path) => {
    history.push(path);
  };

  const addToCart = async (item) => {
    // redirects user to login if not logged in
    const userId = getUserId();
    // if (!userId) redirectTo('/login');

    // disables add to cart button and changes button text to inCart
    const updatedItems = items.map((itemObjs) => {
      if (itemObjs.id === item.id) return Object.assign({}, { ...item, isInCart: true });
      return itemObjs;
    });
    setItems(updatedItems);

    // query cart model to create a user cart

    // query cartItem model to create cart item
    // item needs an association to cart item
    // const { id, quantity } = item;
    // const cartItem = { cartId: userId };
    // const cartItem = axios.post('/cartitem', {});
  };

  const selectTitle = () => {
    console.log(id);
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
    <Container>
      <h2>{selectTitle()}</h2>
      <Row xs={1} md={2} className="g-4 my-4 justify-content-center">
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
    <Col>
      <Card>
        <Card.Img
          variant="top"
          style={{ width: '100%', height: '450px' }}
          className=" img-thumbnail ratio ratio-4x3"
          src={props.item.imageLink}
        />
        <Card.Body>
          <Card.Title>{props.item.name}</Card.Title>
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
