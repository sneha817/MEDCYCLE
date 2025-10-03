import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getInventory } from '../../app/slices/medicineSlice';

const getExpiryStatusStyle = (expiryDate) => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(); 
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry < today) return { backgroundColor: 'var(--bs-danger-bg-subtle)' };
    if (expiry <= thirtyDaysFromNow) return { backgroundColor: 'var(--bs-warning-bg-subtle)' };
    return { backgroundColor: 'var(--bs-success-bg-subtle)' };
};

const Inventory = () => {
    const dispatch = useDispatch();
    const { inventory, loading, error } = useSelector((state) => state.medicines);

    useEffect(() => { 
        dispatch(getInventory()); 
    }, [dispatch]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Shop Inventory</h1>
                <LinkContainer to="/admin/add-medicine">
                    <Button variant="primary">Add Medicine</Button>
                </LinkContainer>
            </div>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='align-middle text-center'>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>QUANTITY</th>
                            <th>EXPIRY DATE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.length === 0 ? (
                            <tr>
                                <td colSpan="5">No medicines in inventory.</td>
                            </tr>
                        ) : (
                            inventory.map((med) => (
                                <tr key={med._id} style={getExpiryStatusStyle(med.expiryDate)}>
                                    <td>{med.name}</td>
                                    <td>{med.category}</td>
                                    <td>{med.quantity}</td>
                                    <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                                    <td className="fw-bold">
                                        {new Date(med.expiryDate) < new Date() ? 'Expired' : new Date(med.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30)) ? 'Nearing Expiry' : 'Safe'}
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

export default Inventory;