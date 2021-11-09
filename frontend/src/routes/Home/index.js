import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
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
    return <h1>LOADING!!!</h1>;
  } else {
    return (
      <Container>
        <Row xs={1} md={2} className="g-4 my-2 mb-3">
          {categories.categories.map((category) => {
            return (
              <CategoryCard
                key={category.id}
                title={category.title}
                imageLink={category.imageLink}
                view={() => viewCategory(category.id)}
              ></CategoryCard>
            );
          })}
        </Row>
      </Container>
    );
  }
}

function CategoryCard({ imageLink, title, view }) {
  return (
    <Col>
      <Card>
        <Card.Img variant="top" src={imageLink} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Button variant="primary" onClick={view}>
            Go to category page
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
