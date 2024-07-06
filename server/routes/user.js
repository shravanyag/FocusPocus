import express from 'express'
import bcrypt from 'bcrypt'
import {User} from '../models/User.js'
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
        next()

    } catch(err){
        return res.json(err);
    }
}

router.get('/verify', verifyUser, async (req, res) => {
    return res.json({status: true, message: "authorised"})
});

router.get('/logout', async (req, res) => {
    res.clearCookie('token')
    return res.json({status: true})
})

export {router as UserRouter}