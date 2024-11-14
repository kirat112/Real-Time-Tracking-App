// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.error(error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// }

// const map = L.map("map").setView([0, 0], 16);
// const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// L.tileLayer(tileUrl, { attribution: "Kirat's Map" }).addTo(map);

// const markers = {};

// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;
//   map.setView([latitude, longitude], 16);
//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//     console.log(markers[id]);
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map);
//   }
// });

// socket.on("user-disconnected", (data) => {
//   const { id } = data;
//   if(markers[id]){
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// });

const socket = io();

// Geolocation function to track and send location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Initialize map
const map = L.map("map").setView([0, 0], 16);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
L.tileLayer(tileUrl, { attribution: "Map Attribution" }).addTo(map);

// Track markers by user ID
const markers = {};

// Listen for location updates and display markers
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // If marker already exists, update it; otherwise, create a new one
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  // Set map view to the latest location received
  map.setView([latitude, longitude], 16);
});

// Remove marker when a user disconnects
socket.on("user-disconnected", (data) => {
  const { id } = data;
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
