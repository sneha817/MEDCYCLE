import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import Message from '../../components/Message';
import { listShops } from '../../app/slices/medicineSlice';
import ShopsMap from '../../components/ShopsMap';
import './ShopsList.css';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// A helper component to programmatically change the map's view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const ShopsList = () => {
    const [keyword, setKeyword] = useState('');
    const [highlightedShop, setHighlightedShop] = useState(null);
    const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]); // Initial map center (Coimbatore)
    const shopRefs = useRef({});
    const dispatch = useDispatch();
    const { shops, loading, error } = useSelector((state) => state.medicines);

    useEffect(() => {
        const timer = setTimeout(() => { dispatch(listShops(keyword)); }, 500);
        return () => clearTimeout(timer);
    }, [keyword, dispatch]);

    const handleMarkerClick = (shopId) => {
        setHighlightedShop(shopId);
        const shop = shops.find(s => s._id === shopId);
        if (shop?.location?.lat) {
            setMapCenter([shop.location.lat, shop.location.lng]);
        }
        shopRefs.current[shopId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleCardHover = (shopId) => {
        setHighlightedShop(shopId);
        const shop = shops.find(s => s._id === shopId);
        if (shop?.location?.lat) {
            setMapCenter([shop.location.lat, shop.location.lng]);
        }
    };

    // This is the component for a single skeleton card
    const SkeletonCard = () => (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title as="div"><strong><Skeleton height={20} width="80%" /></strong></Card.Title>
                <Card.Text><Skeleton count={2} /></Card.Text>
                <Skeleton height={31} width={130} borderRadius={50} />
            </Card.Body>
        </Card>
    );

    return (
        <Row>
            <Col md={5}>
                <h1 className="mb-4">Available Shops</h1>
                <Form className="d-flex mb-4">
                    <Form.Control type="text" onChange={(e) => setKeyword(e.target.value)} placeholder="Search Shops by Name..." />
                </Form>
                <div className="shops-list-container">
                    {error ? <Message variant='danger'>{error}</Message> :
                     loading ? (
                        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                            {/* Create an array of 5 skeletons to show while loading */}
                            {Array(5).fill().map((item, index) => <SkeletonCard key={index} />)}
                        </SkeletonTheme>
                    ) : shops.length === 0 ? (
                        <Message>No shops found.</Message>
                    ) : (
                        shops.map((shop) => (
                            <div key={shop._id} ref={el => shopRefs.current[shop._id] = el}
                                onMouseEnter={() => handleCardHover(shop._id)}
                                onMouseLeave={() => setHighlightedShop(null)}
                            >
                                <Card className={`mb-3 ${highlightedShop === shop._id ? 'highlighted-card' : ''}`}>
                                    <Card.Body>
                                        <Card.Title as="div"><strong>{shop.shopName}</strong></Card.Title>
                                        <Card.Text>{shop.address}</Card.Text>
                                        <Link to={`/shop/${shop._id}`}><Button variant="primary" size="sm">View Medicines</Button></Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </Col>
            <Col md={7} className="map-container">
                <ShopsMap 
                    shops={shops} 
                    highlightedShop={highlightedShop}
                    onMarkerClick={handleMarkerClick}
                    mapCenter={mapCenter}
                />
            </Col>
        </Row>
    );
};

export default ShopsList;