
import express from 'express'
import bcrypt from 'bcrypt'
import {User} from '../models/User.js'
import {Room} from '../models/Room.js'
//import {Chat} from '../models/Chat.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const router = express.Router();

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const user = await User.findOne({email})
    if(user){
        return res.json({message: "user already exists"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    })

    await newUser.save()
    return res.json({status: true, message: "record registered"})
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "user is not registered"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return res.json({message: "password is incorrect!"})
    }

    const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '30d'})
    res.cookie('token', token, { httpOnly: true, maxAge: 500000000})
    return res.json({status: true, message: "login successful"})
})

router.post('/forgot-password', async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.json({message: "user is not registered"})
        }

        const token = jwt.sign({id: user._id}, process.env.KEY, {expiresIn: '5m'})

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'focuspocus.app@gmail.com',
            pass: 'zkse oztx ohna jkek'
        }
        });

        var mailOptions = {
        from: 'focuspocus.app@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.json({message: "error in sending email"})
        } else {
           return res.json({status: true, message: "email sent"})
        }
        });
    }
    catch(err){
        console.log(err)
    }

})

router.post('/reset-password/:token', async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    try{
        const decoded = await jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id: id}, {password: hashPassword})
        return res.json({status: true, message: "updated password"})
    } catch(err){
        return res.json("invalid token")
    }
})

const verifyUser = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.json({status: false, message: "no token"})
        }
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded;
        next()

    } catch(err){
        return res.json(err);
    }
}

router.get('/verify', verifyUser, async (req, res) => {
    const user = await User.findOne({username: req.user.username}).select('username email').populate('rooms');
    if(user){
        return res.json({status: true, message: "authorised", user})
    } else{
        return res.json({status: false, message: "user not found"});
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('token')
    return res.json({status: true})
})

router.post('/create-room', async (req, res) => {
    const { name, user } = req.body;
  
    if (!name) {
      return res.status(400).json({ status: false, message: "Room name is required" });
    }
  
    try {
      // Check if room with the same name already exists
      const existingRoom = await Room.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({ status: false, message: "Room name already exists" });
        
      }
      console.log(existingRoom)
      // Create new room
      const room = new Room({
        name,
        createdBy: user,
      });
      await room.save();
  
      // Update user's rooms array
      await User.findByIdAndUpdate(user, { $push: { rooms: room._id } });
  
      return res.json({ status: true, message: "Room created successfully", room });
    } catch (error) {
      console.error("Error creating room:", error);
      return res.status(500).json({ status: false, message: "Failed to create room" });
    }
  });
  

router.get('/rooms', verifyUser, async (req, res) => {
    const user = await User.findById(req.user._id).populate('rooms');
    return res.json({ status: true, rooms: user.rooms });
});

router.get('/yourRoom/:token', verifyUser, async (req, res) => {
    const { token } = req.params;
    
    try {
      const room = await Room.findById(token).populate('createdBy', 'username');
      if (!room) {
        return res.status(404).json({ status: false, message: "Room not found" });
      }
      return res.json({ status: true, room });
    } catch (error) {
      console.error("Error fetching room:", error);
      return res.status(500).json({ status: false, message: "Error fetching room" });
    }
  });

  router.post('/join-room', async (req, res) => {
    const { name, password } = req.body;
    console.log(req.body);
    try {
      const room = await Room.findOne({ name });
      //console.log("room=");
      //console.log(room);
      if (!room) {
        return res.json({ status: false, message: "Room not found" });
      }
  
      // Direct comparison of password and room.password
      //console.log("password = ");
      //console.log(password);
      //console.log("room.password = ");
      //console.log(room._id.toString());
      if (password !== room._id.toString()) {
        console.log("incorrect pwd");
        return res.json({ status: false, message: "Incorrect password" });
        
      }
  
      return res.json({ status: true, message: "Room joined successfully", room });
    } catch (error) {
      console.error("Error joining room:", error);
      console.log("other error");
      return res.status(500).json({ status: false, message: "Failed to join room" });
    }
  });

export {router as UserRouter}




