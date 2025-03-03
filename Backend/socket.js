const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const coords = position.coords;
    socket.emit("sendLocation", {
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  }, (err) => {
    console.error(err);
  }, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });
}

socket.on("receiveLocation", (data) => {
  const { latitude, longitude } = data;
  const map = L.map("map").setView([latitude, longitude], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map);
});