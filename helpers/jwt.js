const expressjwt = require('express-jwt');

function authjwt(){
    const secret = process.env.secret;
    return expressjwt({
        secret, 
        algorithms: ['HS256'],
        isRevoked:isRevoked
 
    }).unless({
        path:[
            {url: /^\/get\/products\/.*/ , method: ['GET' , 'OPTIONS']},
            {url: /^\/get\/categories\/.*/ , method: ['GET' , 'OPTIONS']},
            '/login-user',
            '/users/register'
        ]
    })
}
 async function isRevoked(req, payload, done){
     if(!payload.isAdmin){
         done(null , true);
     }
     done();

 }
module.exports = authjwt;