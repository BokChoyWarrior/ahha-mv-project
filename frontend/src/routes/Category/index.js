import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { incrementCartItem, getUsersCart } from '../../lib/cart';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Category({ session }) {
  // defined initial useState
  // useState return a variable, and setter or function that changes the variable
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  let categoryName;

  const { id } = useParams();
  const history = useHistory();

  /**
   * makes GET request to /categories endpoint. Uses route category id parameter to request specific category items
   * @returns items array
   */

  const getItems = async () => {
    const response = await axios.get(`/categories/${id}?getNested=true`);

    categoryName = response.data.name;
    return response.data.Items;
  };

  /**
   * checks is a user session is present
   * sets isLoading state component to true while users cart information request completes.
   * adds property to cart
   */

  const refreshItems = async () => {
    setItemsLoading(true);

    let tempCart = [];
    if (session.loggedIn) {
      tempCart = await getUsersCart(session.userId);
    }
    const tempItems = await getItems();

    const quantifiedItems = addQuantityProperty(tempItems, tempCart);

    setItems(quantifiedItems);
    setItemsLoading(false);
  };

  /**
   * adds property to temp
   */

  const addQuantityProperty = (tempItems, tempCart) => {
    console.log(tempItems, tempCart);

    let initialisedItems = tempItems.map((item) => {
      return { ...item, quantityInCart: 0 };
    });

    console.log(initialisedItems);

    initialisedItems.forEach((item) => {
      const index = tempCart.findIndex((cartItem) => item.id === cartItem.id);
      if (index > -1) {
        item.quantityInCart = tempCart[index].CartItem.quantity;
      }
    });

    return initialisedItems;
  };

  // used useEffect to make request to items API from /items
  useEffect(async () => {
    await refreshItems();
  }, []);

  const handleChangeItemQuantity = async (itemId, quantity) => {
    if (!session.loggedIn) {
      history.push('/login');
      return;
    }
    const newQuantityResponse = await incrementCartItem(session.userId, itemId, quantity);

    updateItemQuantity(itemId, newQuantityResponse.data);
  };

  const updateItemQuantity = (itemId, quantity) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        item.quantityInCart = quantity;
        return item;
      }
      return item;
    });
    setItems(newItems);

    console.log('updated quantity:', items);
  };

  if (itemsLoading) {
    return <LoadingSpinner />;
  } else {
    // return list of items in inside of JSX (html) for showing on the browser
    return (
      <Container className="my-4 pb-3">
        <h2 className="display-3 my-2">{categoryName}</h2>
        <Row xs={1} md={4} className="g-4 pt-3 justify-content-center">
          {/* map over the items data pass it into item card */}
          {items.map((item) => {
            return (
              <ItemCard
                key={item.id}
                item={item}
                incrementItem={() => handleChangeItemQuantity(item.id, 1)}
                decrementItem={() => handleChangeItemQuantity(item.id, -1)}
              ></ItemCard>
            );
          })}
        </Row>
      </Container>
    );
  }
}

function ItemCard({ incrementItem, decrementItem, item }) {
  return (
    <Col className="align-self-strech">
      <Card className="h-100">
        <Card.Img
          variant="top"
          style={{ width: '100%', height: '100%', maxHeight: '300px' }}
          className=" img-thumbnail ratio ratio-4x3"
          src={item.imageLink}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <hr />
          <Card.Title>{item.name}</Card.Title>
          <hr />
          <Card.Text className="text-start">{item.description}</Card.Text>
          <Card.Text>£{item.price}</Card.Text>
          <Button disabled={!item.quantityInCart} onClick={() => decrementItem(item.id)} variant="danger">
            -
          </Button>
          {item.quantityInCart}
          <Button onClick={() => incrementItem(item.id)} variant="primary">
            +
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
