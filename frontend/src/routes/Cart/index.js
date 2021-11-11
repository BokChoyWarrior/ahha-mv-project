import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Image, ButtonGroup } from 'react-bootstrap';
import { getUsersCart, getCartDetails, updateCartItemQuant, deleteItemFromCart } from '../../lib/cart';

export default function Cart(props) {
  const [cart, setCart] = useState([]);

  useEffect(async () => {
    const userCart = await getUsersCart(props.session.userId);
    // console.log(userCart);
    // const cartData = await getCartDetails(userCart);

    setCart(userCart);
  }, []);

  const handleRemove = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
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
            return <TableRow key={item.id} item={item} handleRemove={handleRemove}></TableRow>;
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function TableRow(props) {
  const [item, setItem] = useState(props.item);

  const increaseQuant = async (quantity) => {
    setItem({ ...item, quantity: quantity + 1 });
    //make api request to update quantity
    await updateCartItemQuant(item.id, quantity + 1);
  };

  const decreaseQuant = async (quantity) => {
    setItem({ ...item, quantity: quantity - 1 });
    //make api request to update quantity
    await updateCartItemQuant(item.id, quantity - 1);
  };

  const onRemoveClick = async (itemId) => {
    await deleteItemFromCart(itemId);
    props.handleRemove(item);
  };

  return (
    <tr>
      <td>
        <Image style={{ width: '250px' }} src={props.item.imageLink} class="img-fluid" />
      </td>
      <td>{item.name}</td>
      <td>£{item.price}</td>
      <td>{item.CartItem.quantity}</td>
      <td style={{ verticalAlign: 'middle' }}>
        <ButtonGroup vertical className="d-flex align-items-center">
          <Button onClick={() => onRemoveClick(item.id)} variant="danger">
            Remove
          </Button>
          {item.quantity > 1 ? (
            <Button onClick={() => decreaseQuant(item.CartItem.quantity)} variant="warning">
              Descrease
            </Button>
          ) : null}
          <Button onClick={() => increaseQuant(item.CartItem.quantity)}>Increase</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}
