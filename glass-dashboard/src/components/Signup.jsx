import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
   const [formData, setFormData] = useState({
      username: '',
      password: '',
      name: '',
      gender: 'Other'
   });
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
         const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });

         if (response.ok) {
            navigate('/login');
         } else {
            const data = await response.json();
            setError(data.message || 'Failed to sign up');
         }
      } catch (err) {
         setError('Failed to sign up');
      }
   };

   return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
         <Card className="w-100" style={{ maxWidth: '400px' }}>
            <Card.Body>
               <h2 className="text-center mb-4">Sign Up</h2>
               {error && <Alert variant="danger">{error}</Alert>}
               <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                     <Form.Label>Username (ID)</Form.Label>
                     <Form.Control name="username" type="text" required onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Password</Form.Label>
                     <Form.Control name="password" type="password" required onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Name</Form.Label>
                     <Form.Control name="name" type="text" required onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Gender</Form.Label>
                     <Form.Select name="gender" onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                     </Form.Select>
                  </Form.Group>
                  <Button className="w-100" type="submit">
                     Sign Up
                  </Button>
               </Form>
            </Card.Body>
            <Card.Footer className="text-center">
               Already have an account? <Link to="/login">Log In</Link>
            </Card.Footer>
         </Card>
      </Container>
   );
};

export default Signup;
