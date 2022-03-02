import React, { useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
/* global google */

const Map = ({ formattedOrigin, formattedDestination }) => {
  const DirectionsService = new google.maps.DirectionsService();
  let [directions, setDirections] = useState("");

  DirectionsService.route(
    {
      origin: formattedOrigin,
      destination: formattedDestination,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error(`error fetching directions ${result}`);
      }
    }
  );
  return (
    <section className="googleMap">
      <GoogleMap defaultZoom={9} defaultCenter={{ lat: 41.75, lng: 1.8 }}>
        <Marker position={formattedOrigin} />
        <Marker position={formattedDestination} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </section>
  );
};

export default Map;
