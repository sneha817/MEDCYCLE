import React, { useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getUserOrderHistory } from '../../app/slices/orderSlice';

const UserOrderHistory = () => {
    const dispatch = useDispatch();
    const { history, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getUserOrderHistory());
    }, [dispatch]);

    const getStatusBadge = (status) => {
        if (status === 'Accepted') return 'success';
        if (status === 'Rejected') return 'danger';
        return 'warning';
    };

    return (
        <>
            <h1 className="mb-4">My Order History</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th>SHOP</th>
                            <th>MEDICINE</th>
                            <th>QTY</th>
                            <th>DATE REQUESTED</th>
                            <th className="text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">You have not made any requests.</td>
                            </tr>
                        ) : (
                            history.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.shop.shopName}</td>
                                    <td>{order.medicineName}</td>
                                    <td>{order.quantity}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="text-center">
                                        <Badge pill bg={getStatusBadge(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default UserOrderHistory;