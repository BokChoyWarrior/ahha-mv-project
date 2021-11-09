import React, { useState, useEffect } from 'react';
import { FaEdit, FaEraser } from 'react-icons/fa';
import { Card, Button, Container, CardGroup, Row, Table, Col, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';
import axios from '../../lib/axios';

export default function Admin() {
  const history = useHistory();
  const [items, setItems] = useState({ loading: true, items: [] });

  const refreshItems = async () => {
    // const response = await axios.get('/products/categories');
    const response = await axios.get('/items');

    setItems({
      loading: false,
      items: response.data,
    });
    console.log(items);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const viewCategory = (itemId) => {
    history.push(`/items/${itemId}`);
  };

  if (items.loading) {
    return <h1>LOADING!!!</h1>;
  } else {
    return (
      <Container>
        <Row>
          <div>Add new button here</div>
          <div>Sort by category here</div>
        </Row>
        <Row>
          <Col>
            <Table bordered responsive="xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.items.map((item) => {
                  return (
                    <TableData
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      category={item.CategoryId}
                      imageLink={item.imageLink}
                      description={item.description}
                      price={item.price}
                    ></TableData>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

function TableData({ id, name, category, imageLink, description, price }) {
  return (
    <tr style={{ maxHeight: '70px' }}>
      <td>{id}</td>
      <td>{name}</td>
      <td>{category}</td>
      <td>
        <img src={imageLink} style={{ height: '50px' }}></img>
      </td>

      <td style={{ overflowWrap: 'break-word' }}>{description}</td>
      <td>£{price}</td>
      <td>
        <DeleteItemButton id={id} name={name}></DeleteItemButton>
      </td>
    </tr>
  );
}

// const deleteItem = async (id) => {
//   //   const response = await axios.get(`/items/${id}`);
//   await axios.delete(`/items/${id}`);
// };
function DeleteItemButton({ name, id }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <FaEraser style={{ cursor: 'pointer' }} onClick={handleShow}></FaEraser>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {name}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
