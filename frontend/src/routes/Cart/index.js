import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Container, Table, Button, Image, ButtonGroup } from 'react-bootstrap';
import { getUsersCart, deleteItemFromCart, incrementCartItem } from '../../lib/cart';

export default function Cart({ session }) {
  const history = useHistory();
  if (!session.loggedIn) {
    history.push('/');
  }
  const [cart, setCart] = useState([]);

  useEffect(async () => {
    const userCart = await getUsersCart(session.userId);
    console.log(userCart);
    // console.log(userCart);
    // const cartData = await getCartDetails(userCart);

    setCart(addQuantityInCartKey(userCart));
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

    console.log('updated quantity:', cart);
  };

  if (!cart.length) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            return (
              <TableRow
                key={item.id}
                item={item}
                incrementItem={() => handleChangeItemQuantity(item.id, 1)}
                decrementItem={() => handleChangeItemQuantity(item.id, -1)}
                handleRemove={handleRemove}
                session={session}
              ></TableRow>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function TableRow({ item, decrementItem, incrementItem, handleRemove, session }) {
  const onRemoveClick = async (itemId) => {
    await deleteItemFromCart(itemId, session.userId);
    handleRemove(item.id);
  };

  return (
    <tr>
      <td>
        <Image style={{ width: '250px' }} src={item.imageLink} class="img-fluid" />
      </td>
      <td>{item.name}</td>
      <td>£{item.price}</td>
      <td>{item.quantityInCart}</td>
      <td style={{ verticalAlign: 'middle' }}>
        <ButtonGroup vertical className="d-flex align-items-center">
          <Button onClick={() => onRemoveClick(item.id)} variant="danger">
            Remove
          </Button>
          {item.quantityInCart > 1 ? (
            <Button onClick={() => decrementItem(item.id)} variant="warning">
              Descrease
            </Button>
          ) : null}
          <Button onClick={() => incrementItem(item.id)}>Increase</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}
