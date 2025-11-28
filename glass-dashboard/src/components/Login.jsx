import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      const success = await login(username, password);
      if (success) {
         navigate('/dashboard');
      } else {
         setError('Failed to log in');
      }
   };

   return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
         <Card className="w-100" style={{ maxWidth: '400px' }}>
            <Card.Body>
               <h2 className="text-center mb-4">Log In</h2>
               {error && <Alert variant="danger">{error}</Alert>}
               <Form onSubmit={handleSubmit}>
                  <Form.Group id="username" className="mb-3">
                     <Form.Label>Username</Form.Label>
                     <Form.Control type="text" required onChange={(e) => setUsername(e.target.value)} />
                  </Form.Group>
                  <Form.Group id="password" className="mb-3">
                     <Form.Label>Password</Form.Label>
                     <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>
                  <Button className="w-100" type="submit">
                     Log In
                  </Button>
               </Form>
               <div className="w-100 text-center mt-3">
                  <a href="/oauth2/authorization/google" className="btn btn-outline-danger w-100">
                     Log In with Google
                  </a>
               </div>
            </Card.Body>
            <Card.Footer className="text-center">
               Need an account? <Link to="/signup">Sign Up</Link>
            </Card.Footer>
         </Card>
      </Container>
   );
};

export default Login;
