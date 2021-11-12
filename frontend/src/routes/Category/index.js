import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Container, Image } from 'react-bootstrap';
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
      <Container className="my-4">
        <h2 className="display-3 my-2">{categoryName}</h2>
        {/* map over the items data pass it into item card */}
        {items.map((item) => {
          return (
            <>
              <ItemRow
                key={item.id}
                item={item}
                incrementItem={() => handleChangeItemQuantity(item.id, 1)}
                decrementItem={() => handleChangeItemQuantity(item.id, -1)}
              ></ItemRow>
              <hr></hr>
            </>
          );
        })}
      </Container>
    );
  }
}

function ItemRow({ incrementItem, decrementItem, item }) {
  return (
    <Row>
      <Col className="m-auto" xs="3">
        <Image style={{ maxWidth: '6rem', maxHeight: '30rem' }} src={item.imageLink} />
      </Col>
      {/* name and desc */}
      <Col className="m-auto">
        <Row className="m-auto" style={{ textAlign: 'center' }}>
          <h3>{item.name}</h3>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <hr />
          <p style={{ textOverflow: 'ellipsis', maxLines: '5' }}>{item.description}</p>
        </Row>
      </Col>
      <Col className="m-auto" xs="1" lg="2">
        <Row className="my-0">
          <Col>
            <Button disabled={!item.quantityInCart} onClick={() => decrementItem(item.id)} variant="danger">
              -
            </Button>
          </Col>
          <Col>
            <h2>{item.quantityInCart}</h2>
          </Col>
          <Col>
            <Button onClick={() => incrementItem(item.id)} variant="primary">
              +
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
