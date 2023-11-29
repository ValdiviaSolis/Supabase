import { TileLayer, Marker, MapContainer, Popup } from "react-leaflet";

export default function MapComponent({ localizaciones }) {
  const ubicacionesUnicas = localizaciones.filter(
    (ubicacion, index, self) =>
      index ===
      self.findIndex(
        (u) =>
          u.latitude === ubicacion.latitude &&
          u.longitude === ubicacion.longitude
      )
  );

  return (
    <div>
      <MapContainer
        center={[19.2448643340871, -103.71885562832294]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ubicacionesUnicas.map((l, index) => (
          <Marker key={index} position={[l.latitude, l.longitude]}>
            <Popup>
              station_id: {l.station_id}
              <br />
              longitude: {l.longitude}
              <br /> latitude: {l.latitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}