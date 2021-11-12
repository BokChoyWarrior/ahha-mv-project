import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import './home.css';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * Home page component
 * @returns list of navigable categories
 */

export default function Home() {
  const history = useHistory();
  const [categories, setCategories] = useState({ loading: true, categories: [] });

  /**
   * fetches existant item categories information form categories Endpoint
   * updates component state with response body and sets loading property to false
   */

  const refreshCategories = async () => {
    // const response = await axios.get('/products/categories');
    const response = await axios.get('/categories');

    setCategories({
      loading: false,
      categories: response.data,
    });
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const viewCategory = (categoryId) => {
    history.push(`/categories/${categoryId}`);
  };

  /**
   * renders loading, while api request ongoing; otherwise renders category list
   */

  if (categories.loading) {
    return <LoadingSpinner />;
  } else {
    return (
      <Container fluid="md">
        <Row xs={1} md={2} lg={3} xl={4}>
          {categories.categories.map((category) => {
            return (
              <Col key={category.id} className="mx-auto my-2 hover-pointer">
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

/**
 * A bootstrap card containing category details with link to particular category page
 */

function CategoryCard({ imageLink, name, view }) {
  return (
    <Card className="mx-auto hover-shadow" style={{ width: '18rem' }} onClick={view}>
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
