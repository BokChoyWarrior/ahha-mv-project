import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import './home.css';
import axios from '../../lib/axios';

export default function Home() {
  const history = useHistory();
  const [categories, setCategories] = useState({ loading: true, categories: [] });

  const refreshCategories = async () => {
    // const response = await axios.get('/products/categories');
    const response = await axios.get('/categories');

    setCategories({
      loading: false,
      categories: response.data,
    });
    console.log(categories);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const viewCategory = (categoryId) => {
    history.push(`/categories/${categoryId}`);
  };

  if (categories.loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <Container fluid="md">
        <Row xs={1} md={2} lg={4} className="g-4">
          {categories.categories.map((category) => {
            return (
              <Col key={category.id} className="mx-auto hover-pointer">
                <CategoryCard
                  name={category.name}
                  imageLink={category.imageLink}
                  view={() => viewCategory(category.id)}
                ></CategoryCard>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
}

function CategoryCard({ imageLink, name, view }) {
  return (
    <Card className="my-auto hover-shadow" style={{ width: '18rem' }} onClick={view}>
      <Card.Img variant="top" src={imageLink} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Button variant="primary" onClick={view}>
          View {name}
        </Button>
      </Card.Body>
    </Card>
  );
}
