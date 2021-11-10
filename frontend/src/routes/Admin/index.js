import React, { useState, useEffect } from 'react';
import { FaEdit, FaEraser } from 'react-icons/fa';
import {
  Button,
  Container,
  Row,
  Table,
  Col,
  Modal,
  Form,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import './admin.css';
// import { useHistory } from 'react-router';
import axios from '../../lib/axios';

export default function Admin() {
  //   const history = useHistory();
  const [categorySelected, setCategory] = useState(0);

  const handleSelect = (e) => {
    setCategory(parseInt(e));
  };

  const deleteItem = async (id) => {
    await axios.delete(`/items/${id}`);
    refreshItems();
  };

  const [items, setItems] = useState({ loading: true, items: [], categories: [] });

  const refreshItems = async () => {
    const response = await axios.get('/items');
    const response2 = await axios.get('/categories');
    setItems({
      loading: false,
      items: response.data,
      categories: response2.data,
    });
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
            <SortByCategoryButton categories={items.categories} handleSelect={handleSelect}></SortByCategoryButton>
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
                {categorySelected !== 0 &&
                  items.items
                    .filter((e) => e.CategoryId === categorySelected)
                    .map((item) => {
                      const categoryName = items.categories.find((e) => e.id === item.CategoryId).name;
                      return (
                        <TableData
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          category={categoryName}
                          imageLink={item.imageLink}
                          description={item.description}
                          price={item.price}
                          deleteItem={deleteItem}
                        ></TableData>
                      );
                    })}
                {categorySelected === 0 &&
                  items.items.map((item) => {
                    const categoryName = items.categories.find((e) => e.id === item.CategoryId).name;
                    return (
                      <TableData
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        category={categoryName}
                        imageLink={item.imageLink}
                        description={item.description}
                        price={item.price}
                        deleteItem={deleteItem}
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

function TableData({ id, name, category, imageLink, description, price, deleteItem }) {
  return (
    <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <td>{id}</td>
      <td>{name}</td>
      <td>{category}</td>
      <td>
        <img src={imageLink} style={{ height: '50px' }}></img>
      </td>

      <td
        style={{
          maxWidth: '250px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {description}
      </td>
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

        <DeleteItemButton name={name} id={id} deleteItem={deleteItem}></DeleteItemButton>
      </td>
    </tr>
  );
}

function DeleteItemButton({ name, id, deleteItem }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              deleteItem(id);
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
              <Form.Control name="name" defaultValue={name} {...register('name', { required: true })} />
              {errors.name && <p className="error">The Name field is required</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select aria-label="Default select example" defaultValue={category} {...register('CategoryId')}>
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
                defaultValue={imageLink}
                {...register('imageLink', { required: true })}
              />
              {errors.imageLink && <p className="error">The Image Link field is required and needs to be an URL</p>}
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
              <Form.Control defaultValue={price} {...register('price', { required: true, min: 0, max: 1500 })} />
              {errors.price && <p className="error">The Price field is required and needs to be a number up to 1500</p>}
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
              const form = document.getElementById('editForm');
              if (form.getElementsByTagName('p').length === 0) {
                handleClose();
              }
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
              <Form.Control name="name" placeholder="Insert Item Name" {...register('name', { required: true })} />
              {errors.name && <p className="error">The Name field is required</p>}
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
                placeholder="Insert Item Image Link"
                {...register('imageLink', { required: true })}
              />
              {errors.imageLink && <p className="error">The Image Link field is required and needs to be an URL</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: '150px' }}
                placeholder="Insert Item Descritpion"
                {...register('description', { required: true })}
              />
              {errors.description && <p className="error">The Description field is required</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                placeholder="Insert Item Price"
                {...register('price', { required: true, min: 0, max: 1500 })}
              />
              {errors.price && <p className="error">The Price field is required and needs to be a number up to 1500</p>}
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
              const form = document.getElementById('createForm');
              if (form.getElementsByTagName('p').length === 0) {
                handleClose();
              }
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SortByCategoryButton({ categories, handleSelect }) {
  return (
    <ButtonGroup>
      <DropdownButton as={ButtonGroup} title="Category" id="bg-nested-dropdown" onSelect={handleSelect}>
        <Dropdown.Item eventKey={0}>All</Dropdown.Item>
        {categories.map((category, i) => {
          return (
            <Dropdown.Item key={category.id} eventKey={category.id}>
              {category.name}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    </ButtonGroup>
  );
}
