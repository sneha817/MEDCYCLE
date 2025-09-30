import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { listShops } from '../../app/slices/medicineSlice';

const ShopsList = () => {
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();
    const { shops, loading, error } = useSelector((state) => state.medicines);
    
    useEffect(() => {
        dispatch(listShops());
    }, [dispatch]);
    
    const searchHandler = (e) => {
        e.preventDefault();
        dispatch(listShops(keyword));
    }

    return (
        <>
            <h1 className="mb-4">Available Medical Shops</h1>
            <Form onSubmit={searchHandler} className="d-flex mb-4">
                <Form.Control 
                    type="text" 
                    name="q" 
                    onChange={(e) => setKeyword(e.target.value)} 
                    placeholder="Search Shops by Name..." 
                    className="me-2"
                />
                <Button type="submit"  className='outline_btn'>Search</Button>
            </Form>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Row>
                    {shops.length === 0 ? (
                        <Message>No shops found.</Message>
                    ) : (
                        shops.map((shop) => (
                            <Col key={shop._id} sm={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title as="div"><strong>{shop.shopName}</strong></Card.Title>
                                        <Card.Text>{shop.address}</Card.Text>
                                        <Link to={`/shop/${shop._id}`} className="mt-auto">
                                            <Button variant="primary">View Medicines</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}
        </>
    );
};

export default ShopsList;