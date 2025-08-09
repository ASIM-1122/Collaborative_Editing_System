const express = require('express');
const path = require('path')
const app = express();
require('dotenv').config();
const userRouters = require('./routes/documentRoutes')
const connectDB = require('./config/db/database');
const cors = require('cors')


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
// ✅ Allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/document',userRouters)
connectDB();


const port = process.env.PORT || 3001
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})