'use client';

import { GoogleMap } from "@react-google-maps/api";

const defaultMapContainerStyle = {
    width: '100%',
    height: '100vh',
    borderRadius: '15px 0px 0px 15px',
};

const defaultMapZoom = 18;

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
};

interface MapComponentProps {
    center: { lat: number; lng: number };
}

const MapComponent = ({ center }: MapComponentProps) => {
    return (
        <div className="w-full">
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={center}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
            >
            </GoogleMap>
        </div>
    );
};

export { MapComponent };