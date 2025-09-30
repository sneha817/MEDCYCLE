import React, { useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getDonationHistory } from '../../app/slices/orderSlice';

const DonationHistory = () => {
    const dispatch = useDispatch();
    const { donationHistory, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getDonationHistory());
    }, [dispatch]);

    return (
        <>
            <h1 className="mb-4">Donation History</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th>USER NAME/EMAIL</th>
                            <th>AMOUNT</th>
                            <th>DATE PROCESSED</th>
                            <th className="text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donationHistory.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">No donation history found.</td>
                            </tr>
                        ) : (
                            donationHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userName}</td>
                                    <td>{item.amount}</td>
                                    <td>{new Date(item.date).toLocaleString()}</td>
                                    <td className="text-center">
                                        <Badge bg={item.status === 'Accepted' ? 'success' : 'danger'}>
                                            {item.status}
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

export default DonationHistory;