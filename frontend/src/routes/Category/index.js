import React, { useState, useEffect } from 'react';
import { Col, Card, Row, Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from '../../lib/axios';

export default function Category(props) {
  // defined initial useState
  // useState return a variable, and setter or function that changes the viarable
  const { categoryId } = useParams();

  const [items, setItems] = useState([]);
  // used useEffect to make request to items API from /items
  useEffect(async () => {
    const response = await axios.get('/items');
    const cat1 = response.data.filter((item) => item.CategoryId === Number(categoryId));
    setItems(cat1);
  }, []);

  // const

  // returned dummy element with loading as text while the request is made
  if (items.length === 0) {
    return <h1>loading</h1>;
  }

  // return list of items in inside of JSX (html) for showing on the browser
  return (
    <Container>
      <Row xs={1} md={2} className="g-4 my-4 justify-content-center">
        {/* map over the items data pass it into item card */}
        {items.map((item) => {
          return <ItemCard key={item.id} item={item}></ItemCard>;
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
          style={{ width: '100%', height: '15vw' }}
          className="img-thumbnail"
          src={props.item.imageLink}
        />
        <Card.Body>
          <Card.Title>{props.item.name}</Card.Title>
          <Card.Text>{props.item.description}</Card.Text>
          <Card.Text>£{props.item.price}</Card.Text>
          <Button variant="primary">Add to Cart</Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

// export default function Item() {
//   //initial
//   const [items, setItems] = useState(null);

//   useEffect(async () => {
//     const response = await axios.get('/items');
//     const cat1 = response.data.filter((item) => item.CategoryId === 1);
//     setItems(cat1);
//     console.log(cat1);
//   }, []);

//   if (!items) {
//     return <h2>Loading...</h2>;
//   }

//   return (
//     <Row xs={1} md={2} className="g-4">
//       {/* Loop over the category items array */}
//       {/* pass objects into ItemCard */}
//       {items.map((item) => {
//         return <ItemCard key={item.id} item={item}></ItemCard>;
//       })}
//     </Row>
//   );
// }

// function ItemCard(props) {
//   return (
//     <Col>
//       <Card>
//         <Card.Img variant="top" src={props.item.imageLink}  />
//         <Card.Body>
//           <Card.Title>{props.item.name}</Card.Title>
//           <Card.Text>{props.item.description}</Card.Text>
//         </Card.Body>
//       </Card>
//     </Col>
//   );
// }
