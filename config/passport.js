const jwtstrategy = require('passport-jwt').Strategy;
const extractjwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
	let opts = {};
	opts.jwtFromRequest = extractjwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = config.secret;
	passport.use(new jwtstrategy(opts, function(jwt_payload, done) {
		
		console.log(jwt_payload);
		user.getUserById(jwt_payload.data._id, function(err, user) {
			if(err){
				return done(err, false);
			}

			if(user){
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}));	
}
