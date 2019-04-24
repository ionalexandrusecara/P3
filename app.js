/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var d3 = require("d3");

var client_id = '630db823538d40c9a89883dad86850d2'; // Your client id
var client_secret = '97eedd5a8fff4bd18d75a17f17da1135'; // Your secret
var redirect_uri = 'http://localhost:5000/main'; // Your redirect uri

//CHARTS USED FROM D3
var pie = d3.pie()

//DATA USED IN CHARTS
var pie_chart_percentages = [2, 4, 8, 10];
var top_tracks = [];
var top_track_features = [];
var top_track_release_dates = [];
var top_artists = [];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
const users = require('./routes/user');

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/', function(req, res) {
    res.send('Initial page');
});

app.use('/api/users', users);

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/main', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          //console.log(body);
        });

        var top_artists_options = {
            url: 'https://api.spotify.com/v1/me/top/artists?limit=3',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

        request.get(top_artists_options, function(error, response, body) {
            top_artists = body;
        });

        var top_tracks_options = {
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=10',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

        request.get(top_tracks_options, function(error, response, body) {
            top_tracks = body.items;
            top_track_release_dates = [];

            top_tracks.forEach(function(track) {
              top_track_release_dates.push(track.album.release_date)
              
              //get the audio features of each top track
              var track_options = {
                url: 'https://api.spotify.com/v1/audio-features/' + track.id,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };

              request.get(track_options, function(error, response, body) {
                console.log(body);
                top_track_features.push(body)
              });
            });
        });

        res.redirect('http://localhost:3000/dashboard/' +
          querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});