import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Container, Table, Button, Image, ButtonGroup } from 'react-bootstrap';
import { getUsersCart, deleteItemFromCart, incrementCartItem } from '../../lib/cart';
import './Cart.css';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * Represents the entire Cart page at `/mycart`
 * Includes a table of items in cart as well as increment, decrement, and remove functionality
 */

export default function Cart({ session }) {
  const history = useHistory();
  if (!session.loggedIn) {
    history.push('/');
  }
  const [cart, setCart] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  useEffect(async () => {
    const userCart = await getUsersCart(session.userId);

    setCart(addQuantityInCartKey(userCart));
    setIsCartLoading(false);
  }, []);

  const addQuantityInCartKey = (cart) => {
    return cart.map((item) => {
      return { ...item, quantityInCart: item.CartItem.quantity };
    });
  };

  const handleRemove = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const handleChangeItemQuantity = async (itemId, quantity) => {
    if (!session.loggedIn) {
      history.push('/login');
      return;
    }
    const newQuantityResponse = await incrementCartItem(session.userId, itemId, quantity);

    updateItemQuantity(itemId, newQuantityResponse.data);
  };

  const updateItemQuantity = (itemId, quantity) => {
    const newCart = cart.map((item) => {
      if (item.id === itemId) {
        item.quantityInCart = quantity;
        return item;
      }
      return item;
    });
    setCart(newCart);
  };

  if (isCartLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Table bordered hover responsive="lg" size="sm">
        <thead>
          <tr>
            <th name="image">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>#</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            return (
              <Item
                key={item.id}
                item={item}
                incrementItem={() => handleChangeItemQuantity(item.id, 1)}
                decrementItem={() => handleChangeItemQuantity(item.id, -1)}
                handleRemove={handleRemove}
                session={session}
              ></Item>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

/**
 * Cart item Component - each is a row in a table
 */

function Item({ item, decrementItem, incrementItem, handleRemove, session }) {
  const onRemoveClick = async (itemId) => {
    await deleteItemFromCart(itemId, session.userId, item.quantityInCart);
    handleRemove(item.id);
  };

  return (
    <tr>
      <td colSpan="1" name="image">
        <Image width="50" src={item.imageLink} />
      </td>
      <td>{item.name}</td>
      <td>£{item.price}</td>
      <td>{item.quantityInCart}</td>
      <td>
        <ButtonGroup vertical className="d-flex align-items-center">
          <Button onClick={() => incrementItem(item.id)}>Increase</Button>
          {item.quantityInCart > 1 ? (
            <Button onClick={() => decrementItem(item.id)} variant="warning">
              Decrease
            </Button>
          ) : null}
          <Button onClick={() => onRemoveClick(item.id)} variant="danger">
            Remove
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}
