import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getExpiringMedicines } from '../../app/slices/medicineSlice';
import { createOrderRequest, resetOrderSuccess } from '../../app/slices/orderSlice';

const ShopDetails = () => {
    const { id: shopId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedMed, setSelectedMed] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [phone, setPhone] = useState('');

    const { expiring, loading, error } = useSelector((state) => state.medicines);
    const { userInfo } = useSelector((state) => state.auth);
    const { success: orderSuccess, error: orderError, loading: orderLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getExpiringMedicines(shopId));
        if (orderSuccess) {
            setShowModal(false);
            dispatch(resetOrderSuccess());
            // Replaced alert with toast notification
            toast.success('Request submitted successfully! Check your history for status updates.');
        }
    }, [dispatch, shopId, orderSuccess]);

    const handleRequestClick = (med) => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setSelectedMed(med);
            setQuantity(1);
            setPhone('');
            setShowModal(true);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createOrderRequest({ shopId, medicineName: selectedMed.name, quantity, phone, email: userInfo.email }));
    };

    return (
        <>
            <Link className='btn btn-light my-3' to='/shops'>Go Back</Link>
            <h1 className="mb-4">Medicines Available for Donation</h1>
            {orderError && <Message variant='danger'>{orderError}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                expiring.length === 0 ? <Message>No expiring medicines available from this shop at the moment.</Message> :
                <Table striped bordered hover responsive className='align-middle text-center'>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>QTY AVAIL.</th>
                            <th>EXPIRY DATE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expiring.map((med) => (
                            <tr key={med._id}>
                                <td>{med.name}</td>
                                <td>{med.quantity}</td>
                                <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                                <td><Button onClick={() => handleRequestClick(med)}>Request</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {selectedMed && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request {selectedMed.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="my-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' value={userInfo?.email} readOnly />
                            </Form.Group>
                            <Form.Group className="my-2">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type='tel' placeholder="Your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="my-2">
                                <Form.Label>Quantity (Max: {selectedMed.quantity})</Form.Label>
                                <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={selectedMed.quantity} required />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="mt-3" disabled={orderLoading}>
                                {orderLoading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default ShopDetails;