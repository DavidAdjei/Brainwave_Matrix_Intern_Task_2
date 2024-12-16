import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
const {sign} = jwt;
export function generateToken(user) {
    const token = sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'} );
    return token
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export const sendEmail = async (receiver, user, subject, message) => {
    const mailOptions = {
        from: user.email,
        to: receiver,
        subject: subject,
        text: message
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


// const axios = require('axios');
// const qs = require('qs');

// exports.googleOAuth = async (code) => {
//     const url = "https://oauth2.googleapis.com/token";

//     const values = {
//         code,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         redirect_uri: process.env.REDIRECT_URL,
//         grant_type: "authorization_code"
//     };

//     try{
//         const {data} = await axios.post(url, qs.stringify(values), {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }
//         }); 
//         return data;
//     }catch(error){
//         console.log(error.response?.data);
//         throw error;
//     }
// }

// exports.getGoogleUser = async (id_token, access_token) => {
//     try{
//         const url = `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`;
//         const {data} = await axios.get(url, {
//             headers: {
//                 Authorization: `Bearer ${id_token}`
//             }
//         });
//         return data;
//     }catch(error){
//         console.log(error.response?.data, "Error fetching google user");
//         throw error;
//     } 
// }

