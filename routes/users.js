var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		'title': 'Log In'
	});
}); 

router.post('/register',function(req, res, next){
	//get the form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	/*// check for image files
	if (req.files && req.files.profileimage) {
		console.log('Uploading file...');

		//File info
		var profileImageOriginalName = req.files.profileimage.originialname;
		var profileImageName = req.files.profileimage.name;
		var profileImageMime = req.files.profileimage.mimetype;
		var profileImagePath = req.files.profileimage.path;
		var profileImageExt = req.files.profileimage.extension;
		var profileImageSize = req.files.profileimage.size;
	} else {
		//set the default img
		var profileImageName = 'noImage.png';

	}
*/
	// form validation: use express-validator
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors) {
		res.render('register',{
			errors: errors,
			//save user's data for register again
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});

		// create user
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		}); 

		// flash message
		req.flash('success','You are now registered and may log in.');
		res.location('/');
		res.redirect('/');

	}

});



module.exports = router;
