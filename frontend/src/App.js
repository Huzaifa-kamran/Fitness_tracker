import React, { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:5000");

    // Event listener for when the server sends a "notification" event
    socket.on("notification", (data) => {
      console.log("Notification received:", data);
      // You can show the notification here
    });

    // Clean up when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);  // Empty array means this effect runs once when the component mounts

  return (
    <div className="App">
      <h1>Frontend</h1>
      {/* Here, you can add components like a notification display */}
    </div>
  );
}

export default App;
