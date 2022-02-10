// function errorhandler(err , req, res , next){
//     if(err.name === 'UnautorizedEroor'){
//         return res.status(401).json("This Users is Not Authorize")
//     }
//     if(err.name === 'ValidatorError'){
//         return res.status(401).json({message:message.err});
//     }
//     return res.status(500).json(err);
// }
// module.exports = errorhandler ;