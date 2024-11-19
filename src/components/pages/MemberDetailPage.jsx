// src/components/pages/MemberDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import apiClient from '../../axiosConfig';

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  // Fetch book details based on ISBN or ID from API
  apiClient.get(`/User/${id}`)
    .then((response) => {
      setMember(response.data);
      setLoading(false);
    })
    .catch((err) => {
      setError("Failed to load user details.");
      setLoading(false);
    });
}, [id]);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;
if (!member) return <div>Member not found</div>;

  return (
    <div>
      {member ? (
        <Card>
          <Card.Header as="h5">Member Details</Card.Header>
          <Card.Body>
            <Card.Title>{member.name}</Card.Title>
            <Card.Text>
              <strong>Name :</strong> {member.name}
            </Card.Text>
            <Card.Text>
              <strong>Email:</strong> {member.email}
            </Card.Text>
            <Card.Text>
              <strong>Phone:</strong> {member.noHp}
            </Card.Text>
            <Button variant="primary" onClick={() => navigate('/members')}>
              Back to Members List
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading member details...</p>
      )}
    </div>
  );
};

export default MemberDetailPage;