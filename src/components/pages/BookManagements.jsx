import React,{useState, useEffect} from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BookList from '../organisms/BookList';
import apiClient from '../../axiosConfig';

const BookManagemets = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch books from API
    apiClient.get('/Book')
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load books.");
        setLoading(false);
      });
  }, []);

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <h1>Books</h1>
      <Link to="/books/add">
        <Button variant="primary" className="mb-3">Add New Book</Button>
      </Link>
      <BookList books={books} />
    </Container>
  );
};

export default BookManagemets;