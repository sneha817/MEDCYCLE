import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { addMedicine, resetMedicineSuccess } from '../../app/slices/medicineSlice';

const AddMedicine = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [category, setCategory] = useState('General');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.medicines);

    useEffect(() => {
        if (success) {
            setMessage('Medicine Added Successfully!');
            setName('');
            setQuantity('');
            setExpiryDate('');
            setCategory('General'); // Reset category state
            const timer = setTimeout(() => {
                setMessage('');
                dispatch(resetMedicineSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(addMedicine({ name, quantity, expiryDate, category }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={6} lg={5}>
              <Card className="p-4">
                <Card.Body>
                  <h1 className="text-center mb-4">Add New Medicine</h1>
                  {message && <Message variant='success'>{message}</Message>}
                  {error && <Message variant='danger'>{error}</Message>}
                  {loading && <Loader />}
                  <Form onSubmit={submitHandler}>
                      <Form.Group className="my-3" controlId='name'>
                          <Form.Label>Medicine Name</Form.Label>
                          <Form.Control type='text' placeholder='Enter medicine name' value={name} onChange={(e) => setName(e.target.value)} required />
                      </Form.Group>
                      
                      <Form.Group className="my-3" controlId='category'>
                          <Form.Label>Category</Form.Label>
                          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                              <option>Painkiller</option>
                              <option>Antibiotic</option>
                              <option>Antiseptic</option>
                              <option>Antacid</option>
                              <option>Supplement</option>
                              <option>General</option>
                          </Form.Select>
                      </Form.Group>

                      <Form.Group className="my-3" controlId='quantity'>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control type='number' placeholder='Enter quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
                      </Form.Group>

                      <Form.Group className="my-3" controlId='expiryDate'>
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control type='date' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={today} required />
                      </Form.Group>
                      
                      <div className="d-grid">
                          <Button type='submit' variant='primary' className="mt-3">Add Medicine</Button>
                      </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
        </Row>
    );
};

export default AddMedicine;