import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { register, clearError } from '../../app/slices/authSlice';

const AdminRegister = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [gstId, setGstId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (adminInfo) navigate('/admin/inventory');
  }, [adminInfo, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(register({ endpoint: 'admin', details: { shopName, address, gstId, password } }));
    }
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6} lg={5}>
        <Card className="p-4">
          <Card.Body>
            <h1 className="text-center mb-4">Register Your Shop</h1>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2" controlId="shopName">
                <Form.Label>Shop Name</Form.Label>
                <Form.Control type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="my-2" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </Form.Group>
              <Form.Group className="my-2" controlId="gstId">
                <Form.Label>GST ID</Form.Label>
                <Form.Control type="text" value={gstId} onChange={(e) => setGstId(e.target.value)} required />
              </Form.Group>
              <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Form.Group className="my-2" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </Form.Group>
              <div className="d-grid">
                <Button type="submit" variant="primary" className="mt-3">Register</Button>
              </div>
            </Form>
            <Row className="py-3">
              <Col className="text-center">
                Already have an Account? <Link to="/admin/login">Login</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminRegister;