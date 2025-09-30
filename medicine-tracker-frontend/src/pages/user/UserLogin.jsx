import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { login, clearError } from '../../app/slices/authSlice';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (userInfo) {
      navigate('/shops');
    }
  }, [userInfo, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ endpoint: 'users', credentials: { email, password } }));
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6} lg={5}>
        <Card className="p-4">
          <Card.Body>
            <h1 className="text-center mb-4">Sign In</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
              <Form.Group className="my-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary" className="mt-3">Sign In</Button>
              </div>
            </Form>
            <Row className="py-3">
              <Col className="text-center">
                New Here? <Link to="/register">Register</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserLogin;