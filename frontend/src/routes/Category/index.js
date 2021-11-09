import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../lib/axios';

export default function Category(props) {
  // defined initial useState
  // useState return a variable, and setter or function that changes the viarable
  const [items, setItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

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

  const renderAlert = () => {
    setShowAlert(true);
  };

  const updateAddToCartButton = (item) => {
    const updatedItems = items.map((itemObjs) => {
      if (itemObjs.id === item.id) return Object.assign({}, { ...item, isInCart: true });
      return itemObjs;
    });
    setItems(updatedItems);
  };

  const queryCartItemApi = async (cartId, item) => {
    const getCartItem = await axios.get(`/cartItems/${item.id}`);
    const data = getCartItem.data;
    if (!Object.values(data).length) {
      return await axios.post('/cartItems', { id: item.id, quantity: 1, CartId: cartId });
    }
  };

  const addToCart = async (item) => {
    const cartId = props.cartId;

    //uncomment when done with other parts
    // if (!cartId) {
    //   renderAlert();
    //   return;
    // }

    // if (!userId) redirectTo('/login');

    // disables add to cart button and changes button text to inCart
    updateAddToCartButton(item);

    // check if cart item exists

    //actual
    // const cartItemGetReqest = await axios.get(`/cartItems/${item.id}`)
    //dummy

    const cartItem = await queryCartItemApi(cartId, item);
    console.log(cartItem);

    // // // query cart model to create a user cart

    // //check if cart already exists

    // const cartGet = await axios.get(`/cart/${1}`);

    // console.log(cartGet.data);

    // // creates a cart
    // // pass {id: userId} into request body once defined as second parameter

    // //check if cart exists
    // if (!cartGet.data) {
    //   //if not create cart and add cart item
    //   const createCartResponse = await axios.post('/cart');
    //   const cartData = createCartResponse.data;
    //   const createCartItemResponse = await axios.post('/cartItems', { id: item.id, quantity: 1, CartId: cartData.id });
    // } else {
    //   const cartData = cartGet.data;
    //   // get cartItem and increcement amount
    //   const cartItemGetReq = await axios.get(`/cartItems/${item.id}`);
    //   if (cartItemGetReq.status !== 200) {
    //   }
    // }
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
    <Container>
      <h2 className="display-2">{selectTitle()}</h2>
      <AlertDismissible show={showAlert} setShow={setShowAlert} />
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
    <Col className="align-self-strech">
      <Card className="text-left">
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

function AlertDismissible({ show, setShow }) {
  return (
    <>
      <Alert show={show} variant="danger">
        <Alert.Heading>Please Log In to Add Items to Cart</Alert.Heading>

        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close
          </Button>
        </div>
      </Alert>
    </>
  );
}
