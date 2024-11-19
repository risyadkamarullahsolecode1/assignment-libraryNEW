import React, {useState,useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import apiClient from '../../axiosConfig';

const BookDetailPage = ({ books }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get(`/Book/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load book details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
        <Card.Text>
          <strong>ISBN:</strong> {book.isbn}<br />
          <strong>Title:</strong> {book.title}<br />
          <strong>Author:</strong> {book.author}<br />
          <strong>Publication Year:</strong> {book.publicationYear}
        </Card.Text>
        <Link to={`/books/edit/${book.isbn}`}>
          <Button variant="warning">Edit</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BookDetailPage;