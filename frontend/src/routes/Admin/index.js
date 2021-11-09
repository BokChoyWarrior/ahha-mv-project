import React, { useState, useEffect } from 'react';
import { FaEdit, FaEraser } from 'react-icons/fa';
import { Card, Button, Container, CardGroup, Row, Table, Col, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
// import { useHistory } from 'react-router';
import axios from '../../lib/axios';

export default function Admin() {
  //   const history = useHistory();
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

  //   const viewCategory = (itemId) => {
  //     history.push(`/items/${itemId}`);
  //   };

  if (items.loading) {
    return <h1>LOADING!!!</h1>;
  } else {
    return (
      <Container>
        <Row className="mt-2 mb-2">
          <Col>
            <CreateItemButton></CreateItemButton>
          </Col>
          <Col>
            <div>Sort by category here</div>
          </Col>
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
        <EditItemButton
          id={id}
          name={name}
          category={category}
          imageLink={imageLink}
          description={description}
          price={price}
        ></EditItemButton>

        <DeleteItemButton id={id} name={name}></DeleteItemButton>
      </td>
    </tr>
  );
}

function DeleteItemButton({ name, id }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const deleteItem = async () => {
    await axios.delete(`/items/${id}`);
  };

  return (
    <>
      <FaEraser style={{ cursor: 'pointer', color: 'red' }} onClick={handleShow}></FaEraser>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {name}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteItem();
              handleClose();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function EditItemButton({ name, id, category, imageLink, description, price }) {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    await axios.put(`/items/${data.id}`, {
      name: data.name,
      CategoryId: data.CategoryId,
      imageLink: data.imageLink,
      description: data.description,
      price: data.price,
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <FaEdit style={{ cursor: 'pointer', color: 'blue' }} onClick={handleShow}></FaEdit>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} id="editForm">
            <input type="hidden" name="id" value={id} {...register('id')} />
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" defaultValue={name} {...register('name')} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                type="CategoryId"
                aria-label="Default select example"
                defaultValue={category}
                {...register('CategoryId')}
              >
                {/* could be better implemented by looping over categories api */}
                <option value="1">Jewellery</option>
                <option value="2">Electronics</option>
                <option value="3">Women&apos;s Clothing</option>
                <option value="4">Men&apos;s Clothing</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: '100px' }}
                type="imageLink"
                defaultValue={imageLink}
                {...register('imageLink')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: '150px' }}
                type="description"
                defaultValue={description}
                {...register('description')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="price" defaultValue={price} {...register('price')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Body>Click Submit to edit {name}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            form="editForm"
            variant="success"
            onClick={() => {
              handleClose();
            }}
          >
            Sumbit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function CreateItemButton() {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    await axios.post(`/items`, {
      name: data.name,
      CategoryId: data.CategoryId,
      imageLink: data.imageLink,
      description: data.description,
      price: data.price,
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button style={{ cursor: 'pointer' }} onClick={handleShow}>
        {' '}
        Create Item
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} id="createForm">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" placeholder="Insert Item Name" {...register('name')} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select type="CategoryId" aria-label="Default select example" {...register('CategoryId')}>
                {/* could be better implemented by looping over categories api */}
                <option value="1">Jewellery</option>
                <option value="2">Electronics</option>
                <option value="3">Women&apos;s Clothing</option>
                <option value="4">Men&apos;s Clothing</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: '100px' }}
                type="imageLink"
                placeholder="Insert Item Image Link"
                {...register('imageLink')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: '150px' }}
                type="description"
                placeholder="Insert Item Descritpion"
                {...register('description')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="price" placeholder="Insert Item Price" {...register('price')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Body>Click Submit to Create {name}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            form="createForm"
            variant="success"
            onClick={() => {
              handleClose();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
