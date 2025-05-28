// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Sửa lỗi icon marker
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// const Contact = () => {
//   const defaultPosition = [21.006382, 105.841377]; // Vị trí Đại học Bách Khoa Hà Nội

//   return (
//     <div className="container mt-4">
//       <h2>Liên hệ với chúng tôi</h2>
//       <p>Địa chỉ: Đại học Bách Khoa Hà Nội, Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
//       <MapContainer
//         center={defaultPosition}
//         zoom={17}
//         scrollWheelZoom={true}
//         style={{ height: '400px', width: '100%' }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={defaultPosition}>
//           <Popup>
//             Đại học Bách Khoa Hà Nội
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// };

// export default Contact;
