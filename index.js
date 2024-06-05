const express = require('express');
const app = express();
const cors = require('cors');


const dotenv = require('dotenv');
dotenv.config();

const mongoConnection = require('./Database/dbConnection.js');
mongoConnection();


const auth = require('./src/modules/auth/auth.routes.js');
const hotel = require('./src/modules/hotel/hotel.routes.js');
const rooms = require('./src/modules/rooms/rooms.routes.js');
const booking = require('./src/modules/booking/booking.routes.js');



// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// Middleware
app.use(cors());
app.use(express.json());

 
// Routes
app.use('/api/auth', auth);
app.use('/api/hotel', hotel);
app.use('/api/rooms', rooms);
app.use('/api/booking', booking);





// 404 route
app.use('*', (req, res) => {
  res.status(404).json({ 'Msg': 'I Can\'t Found' });
});