import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Edit3, Check, X, Navigation } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useGeolocationStore } from "@/store/geolocationStore";
import { reverseGeocode } from "@/apis/nominatim/reverseGeocode";

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function HomeLocationCard() {
  const homeLocation = useAppStore((state) => state.homeLocation);
  const setHomeLocation = useAppStore((state) => state.setHomeLocation);
  const currentPosition = useGeolocationStore((state) => state.currentPosition);
  const [isEditing, setIsEditing] = useState(false);
  
  // Use current position as default, fallback to Hanoi
  const getInitialPosition = () => {
    if (currentPosition) {
      return { lat: currentPosition.latitude, lng: currentPosition.longitude };
    }
    if (homeLocation) {
      return { lat: homeLocation.latitude, lng: homeLocation.longitude };
    }
    return { lat: 21.0285, lng: 105.8542 }; // Default to Hanoi
  };
  
  const [tempLocation, setTempLocation] = useState(getInitialPosition);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Update tempLocation when currentPosition changes and we're not editing
  useEffect(() => {
    if (currentPosition && !isEditing && !homeLocation) {
      setTempLocation({ lat: currentPosition.latitude, lng: currentPosition.longitude });
    }
  }, [currentPosition, isEditing, homeLocation]);

  useEffect(() => {
    if (isEditing && mapRef.current && !mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapRef.current).setView([tempLocation.lat, tempLocation.lng], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([tempLocation.lat, tempLocation.lng], {
        draggable: true
      }).addTo(map);

      // Update position when marker is dragged
      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        setTempLocation({ lat: position.lat, lng: position.lng });
      });

      // Update position when map is clicked
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setTempLocation({ lat, lng });
        marker.setLatLng([lat, lng]);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isEditing, tempLocation.lat, tempLocation.lng]);

  // Update marker position when tempLocation changes
  useEffect(() => {
    if (markerRef.current && isEditing) {
      markerRef.current.setLatLng([tempLocation.lat, tempLocation.lng]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([tempLocation.lat, tempLocation.lng], 13);
      }
    }
  }, [tempLocation, isEditing]);

  const handleSave = async () => {
    try {
      // Sử dụng API reverseGeocode mới
      const data = await reverseGeocode(tempLocation.lat, tempLocation.lng, "vi");
      const address = data.display_name || `${tempLocation.lat.toFixed(6)}, ${tempLocation.lng.toFixed(6)}`;
      setHomeLocation({
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
        address: address,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to get address:", error);
      // Save without address if geocoding fails
      setHomeLocation({
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
        address: `${tempLocation.lat.toFixed(6)}, ${tempLocation.lng.toFixed(6)}`,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (homeLocation) {
      setTempLocation({ lat: homeLocation.latitude, lng: homeLocation.longitude });
    } else if (currentPosition) {
      setTempLocation({ lat: currentPosition.latitude, lng: currentPosition.longitude });
    }
    setIsEditing(false);
  };

  const handleMoveToCurrentLocation = () => {
    if (currentPosition) {
      setTempLocation({ lat: currentPosition.latitude, lng: currentPosition.longitude });
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center space-x-2">
          <Home className="w-4 h-4 text-greenery-600" />
          <span>Home Location</span>
        </CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-1">
            {currentPosition && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMoveToCurrentLocation}
                className="h-8 w-8 p-0 text-blue-600"
                title="Move pin to current location"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 text-green-600"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {homeLocation && !isEditing ? (
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{homeLocation.address}</p>
                <p className="text-xs text-gray-500">
                  {homeLocation.latitude.toFixed(6)}, {homeLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        ) : isEditing || !homeLocation ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {isEditing ? "Click on the map to set your home location:" : "No home location set. Click edit to add one."}
              {currentPosition && (
                <span className="block text-xs text-green-600 mt-1">
                  📍 Current location detected and centered on map
                </span>
              )}
            </p>
            
            {/* Leaflet map container */}
            <div
              ref={mapRef}
              className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden border-2 border-dashed border-gray-300"
            >
              {!isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click edit to select location</p>
                  </div>
                </div>
              )}
            </div>

            {!homeLocation && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-greenery-500 hover:bg-greenery-600 text-white"
                size="sm"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Set Home Location
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}