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
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * Admin Page Component
 */

export default function Admin() {
  // comment
  //   const history = useHistory();
  const [categorySelected, setCategory] = useState(0);

  const handleSelect = (e) => {
    setCategory(parseInt(e));
  };

  /**
   * deletes item
   */

  const deleteItem = async (id) => {
    await axios.delete(`/items/${id}`);
    refreshItems();
  };

  const onSubmitEdit = async (data) => {
    await axios.put(`/items/${data.id}`, {
      name: data.name,
      CategoryId: data.CategoryId,
      imageLink: data.imageLink,
      description: data.description,
      price: data.price,
    });
    refreshItems();
  };

  const onSubmitCreate = async (data) => {
    await axios.post(`/items`, {
      name: data.name,
      CategoryId: data.CategoryId,
      imageLink: data.imageLink,
      description: data.description,
      price: data.price,
    });
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
    return <LoadingSpinner />;
  } else {
    return (
      <Container>
        <Row className="mt-2 mb-2">
          <Col>
            <CreateItemButton onSubmitCreate={onSubmitCreate}></CreateItemButton>
          </Col>
          <Col>
            <SortByCategoryButton categories={items.categories} handleSelect={handleSelect}></SortByCategoryButton>
          </Col>
        </Row>
        <Row>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th id="categoryHeader">Category</th>
                <th id="imageHeader">Image</th>
                <th id="descriptionHeader">Description</th>
                <th id="priceHeader">Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
                        onSubmitEdit={onSubmitEdit}
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
                      onSubmitEdit={onSubmitEdit}
                    ></TableData>
                  );
                })}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

/**
 * @returns table row
 */

function TableData({ id, name, category, imageLink, description, price, deleteItem, onSubmitEdit }) {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td id="category">{category}</td>
      <td id="image">
        <img src={imageLink} style={{ height: '50px' }}></img>
      </td>

      <td
        id="description"
        style={{
          maxWidth: '250px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {description}
      </td>
      <td id="price">£{price}</td>
      <td>
        <EditItemButton
          id={id}
          name={name}
          category={category}
          imageLink={imageLink}
          description={description}
          price={price}
          onSubmitEdit={onSubmitEdit}
        ></EditItemButton>

        <DeleteItemButton name={name} id={id} deleteItem={deleteItem}></DeleteItemButton>
      </td>
    </tr>
  );
}

/**
 * @returns delete item button
 */

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

/**
 *
 * @param {name} param0 item name
 * @param {id} param1 item id
 * @param {category} param2 item category
 * @param {imageLink} param3 image url for item
 * @param {description} param4 item description
 * @param {price} param5 item price
 * @param {onSubmitEdit} param6 form submission event handler function
 * @returns a modal that contains form that edits item details. Field contain current item details
 */

function EditItemButton({ name, id, category, imageLink, description, price, onSubmitEdit }) {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          <Form onSubmit={handleSubmit(onSubmitEdit)} onLoad={handleSubmit(onSubmitEdit)} id="editForm">
            <input type="hidden" name="id" value={id} {...register('id')} />
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" defaultValue={name} id="editName" {...register('name', { required: true })} />
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
                id="editImageLink"
                defaultValue={imageLink}
                {...register('imageLink', { required: true })}
              />
              {errors.imageLink && <p className="error">The Image Link field is required and needs to be an URL</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                id="editDescription"
                style={{ height: '150px' }}
                type="description"
                defaultValue={description}
                {...register('description')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                defaultValue={price}
                id="editPrice"
                {...register('price', { required: true, min: 0, max: 1500 })}
              />
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
              const name = document.getElementById('editName').value;
              const imageLink = document.getElementById('editImageLink').value;
              const description = document.getElementById('editDescription').value;
              const price = document.getElementById('editPrice').value;
              // if (form.getElementsByTagName('p').length === 0) {
              if (name !== '' && imageLink !== '' && description !== '' && price !== '') {
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

/**
 *
 * @param {onSubmitCreate} param0  form submission event handler function
 * @returns a modal with a form for creating a item for a category
 */

function CreateItemButton({ onSubmitCreate }) {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          <Form onSubmit={handleSubmit(onSubmitCreate)} id="createForm">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                id="createName"
                name="name"
                placeholder="Insert Item Name"
                {...register('name', { required: true })}
              />
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
                id="createImageLink"
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
                id="createDescription"
                style={{ height: '150px' }}
                placeholder="Insert Item Descritpion"
                {...register('description', { required: true })}
              />
              {errors.description && <p className="error">The Description field is required</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                id="createPrice"
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
              const name = document.getElementById('createName').value;
              const imageLink = document.getElementById('createImageLink').value;
              const description = document.getElementById('createDescription').value;
              const price = document.getElementById('createPrice').value;
              // if (form.getElementsByTagName('p').length === 0) {
              if (name !== '' && imageLink !== '' && description !== '' && price !== '') {
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

/**
 *
 * @param {caregories} param0 array of category objects
 *  @param {handleSelect} param1 event handler for dropdown selection
 * @returns dropdown button element with list of categories
 */

function SortByCategoryButton({ categories, handleSelect }) {
  return (
    <ButtonGroup>
      <DropdownButton as={ButtonGroup} title="Category" id="bg-nested-dropdown" onSelect={handleSelect}>
        <Dropdown.Item eventKey={0}>All</Dropdown.Item>
        {categories.map((category) => {
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
