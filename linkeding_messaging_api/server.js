const express = require('express');
const app = express();
const port = 4000;
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const nodeLinkedIn = require('node-linkedin');

passport.use(new LinkedInStrategy({
    clientID: '774ztjp957sfki',
    clientSecret: 'SZyLC1OdhLKcW6zl',
    callbackURL: 'https://4ca4-45-86-82-147.ngrok-free.app/auth/linkedin/callback',
    scope: ['openid', 'profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }), async(req, res) => {
    const profile = req;
    console.log(profile);
    
    // Use the access token to call the LinkedIn Messaging API
    // const linkedin = new nodeLinkedIn(profile.id, profile.access_token);
    // const messages = await linkedin.getMessages();
    
    // console.log(messages);
    
    res.send('Success!');
    });



app.listen(port, () => {
    console.log("App is listening at host: http://localhost:" + port);
});