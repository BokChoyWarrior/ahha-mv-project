import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { incrementCartItem, getUsersCart } from '../../lib/cart';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * List of items in a category that can be added to cart- quantity can be increased/decreased
 */

export default function Category({ session }) {
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  let categoryName;

  const { id } = useParams();
  const history = useHistory();

  /**
   * makes GET request to /categories endpoint. Uses route category id parameter to request specific category items
   * @returns array of items objects
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
   *
   * adds property to item object for simpler retrieval and manipulation of quantity
   * value is zero or set to quantity for item in cart for user session
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

  /**
   * Attempts to change item quantity in user's cart.
   * Will redirect to login if there is no session logged in.
   * We would lke to update the quantity seen by the user, when they request the change
   */
  const handleChangeItemQuantity = async (itemId, quantity) => {
    if (!session.loggedIn) {
      history.push('/login');
      return;
    }
    const newQuantityResponse = await incrementCartItem(session.userId, itemId, quantity);

    updateItemQuantity(itemId, newQuantityResponse.data);
  };

  /**
   * Updates quantity of for displaying on client
   * @param {number} itemId
   * @param {number} quantity
   */
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
