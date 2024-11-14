const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
L.tileLayer(tileUrl, { attribution: "Kirat's Map" }).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
    console.log(markers[id]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (data) => {
  const { id } = data;
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});