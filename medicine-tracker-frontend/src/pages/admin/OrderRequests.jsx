import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getShopOrderRequests, handleOrderRequest } from '../../app/slices/orderSlice';

const OrderRequests = () => {
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getShopOrderRequests());
        const interval = setInterval(() => {
            dispatch(getShopOrderRequests());
        }, 10000); // Poll for new requests every 10 seconds
        
        return () => clearInterval(interval); // Cleanup on unmount
    }, [dispatch]);

    const handleAction = (id, status) => {
        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            dispatch(handleOrderRequest({ id, status }));
        }
    };

    const pendingRequests = requests.filter(req => req.status === 'Pending');

    return (
        <>
            <h1 className="mb-4">Medicine Order Requests</h1>
            {loading && !pendingRequests.length ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                pendingRequests.length === 0 ? <Message>No pending requests at the moment.</Message> :
                <Table striped bordered hover responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th>MEDICINE</th>
                            <th>QTY</th>
                            <th>REQUESTOR EMAIL</th>
                            <th>PHONE</th>
                            <th className="text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRequests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.medicineName}</td>
                                <td>{req.quantity}</td>
                                <td><a href={`mailto:${req.email}`}>{req.email}</a></td>
                                <td>{req.phone}</td>
                                <td className="text-center">
                                    <Button variant='success' className='btn-sm me-2' onClick={() => handleAction(req._id, 'Accepted')}>Accept</Button>
                                    <Button variant='danger' className='btn-sm' onClick={() => handleAction(req._id, 'Rejected')}>Reject</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default OrderRequests;