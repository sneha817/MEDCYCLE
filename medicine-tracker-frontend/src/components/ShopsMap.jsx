import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// A helper component to change the map's view when state changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const ShopsMap = ({ shops, highlightedShop, onMarkerClick, mapCenter }) => {
    const defaultCenter = [11.0168, 76.9558]; // Default to Coimbatore

    return (
        <MapContainer 
            center={mapCenter || defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
        >
            <ChangeView center={mapCenter || defaultCenter} zoom={13} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {shops.map(shop => (
                shop.location?.lat && (
                    <Marker
                        key={shop._id}
                        position={[shop.location.lat, shop.location.lng]}
                        eventHandlers={{
                            click: () => onMarkerClick(shop._id),
                        }}
                    >
                        <Popup>{shop.shopName}</Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
};

export default ShopsMap;