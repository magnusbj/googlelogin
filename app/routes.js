var gcal = require('google-calendar');
var bodyParser = require('body-parser');
var moment = require('moment'); // for setting date

module.exports = function(app, passport, winston) {


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
	res.render('index.ejs'); // load the index.ejs file
	console.log(req.ip);
	});

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
	successRedirect : '/profile',
	failureRedirect : '/login',
	failureFlash : true
    }));

    

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/profile',
	failureRedirect : '/signup',
	failureFlash : true
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile.ejs', {
	    user : req.user // get the user out of session and pass to template
	    });
	});

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
	});

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            })
	   );
    // =============================
    // Google calendar functions
    // =============================
    // following the google API

    app.get('/calendar', isLoggedIn, function(req, res){
	console.log(req.ip);
	res.render('calendar.ejs', {
	user : req.user }
		  );
    });

    app.post('/calendar', isLoggedIn, function(req, res){
	var accessToken = req.user.google.token;
	console.log("Token: " + accessToken);
	var time = new Date().toISOString();
	var google_calendar = new gcal.GoogleCalendar(accessToken);
	google_calendar.events.list('johanne.fonnes@gmail.com', {timeMin: time, orderBy: 'startTime', singleEvents: 'True'}, function (err, data){
	    if (err){ console.log("Something wrong: " + err)};
            res.render('events.ejs', {
		user : req.user,
		data: data,
		moment: moment}
                      );
	});
    });

};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
	return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
