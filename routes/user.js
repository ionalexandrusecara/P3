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
const router = express.Router();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var d3 = require("d3");

var client_id = '630db823538d40c9a89883dad86850d2'; // Your client id
var client_secret = '97eedd5a8fff4bd18d75a17f17da1135'; // Your secret
var redirect_uri = 'http://localhost:5000/api/users/main'; // Your redirect uri

//DATA USED IN CHARTS
var top_tracks = [];
var top_track_features = [];
var top_track_release_dates = [];
var top_release_dates_count = [];
var top_artists = [];
var top_artists_popularity = [];
var top_tracks_popularity = [];
var top_genres = [];
var top_track_inst = [];

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

router.post('/data', function(req, res) {
  console.log("DATA");
  res.send({
    top_tracks_popularity: top_tracks_popularity,
    top_track_inst: top_track_inst,
    top_track_features: top_track_features,
    top_release_dates_count: top_release_dates_count,
    top_genres: top_genres
  });
});

router.post('/login', function(req, res) {
  console.log("LOGIN");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/main', function(req, res) {

  console.log("MAIN");

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
            url: 'https://api.spotify.com/v1/me/top/artists?limit=100',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
        request.get(top_artists_options, function(error, response, body) {
            top_artists = body.items;
            var popularity = [];
            var genres = [];

            //get popularity index of each artist
            for (var i = 0; i < top_artists.length; i++) {
              //console.log((i+1) + '. ' + top_artists[i].name);
              top_artists_popularity.push({key: top_artists[i].name,
                                            value: top_artists[i].popularity});

              for (var j = 0; j < top_artists[i].genres.length; j++) {
                genres.push(top_artists[i].genres[j]);
              }
            }

            //count occurences of each genre
            var a = [], b = [], prev;
            genres.sort();

            for ( var i = 0; i < genres.length; i++ ) {
              if ( genres[i] !== prev ) {
                  a.push(genres[i]);
                  b.push(1);
              } else {
                  b[b.length-1]++;
              }
              prev = genres[i];
            }
            
            for ( var i = 0; i < a.length; i++) {
              top_genres.push({key: a[i],
                              val: b[i]});
            }

            top_genres.sort(compare);

            //console.log(a);
            //console.log(b);
            //console.log(top_genres);
        });

        var top_tracks_options = {
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=100',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

        request.get(top_tracks_options, function(error, response, body) {
            top_tracks = body.items;
            top_track_release_dates = [];
            var count = 1;

            top_tracks.forEach(function(track) {
              //console.log(count + '. ' + track.artists[0].name + ' - ' + track.name)
              count++;

              //add track release year to array
              top_track_release_dates.push(track.album.release_date.substring(0, 4));

              //get popularity index for each top track
              top_tracks_popularity.push({key: track.name,
                                            value: track.popularity});

              //get the audio features of each top track
              var track_options = {
                url: 'https://api.spotify.com/v1/audio-features/' + track.id,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };

              request.get(track_options, function(error, response, body) {
                top_track_features.push({key: track.name,
                                          value: body})
                top_track_inst.push({key: track.name,
                                      value: body.instrumentalness});
              });
            });

            //count occurences of each release date
            var a = [], b = [], prev;
            var temp_release = top_track_release_dates.sort();

            for ( var i = 0; i < temp_release.length; i++ ) {
              if ( temp_release[i] !== prev ) {
                  a.push(temp_release[i]);
                  b.push(1);
              } else {
                  b[b.length-1]++;
              }
              prev = temp_release[i];
            }
            
            for ( var i = 0; i < a.length; i++ ) {
              top_release_dates_count.push({key: a[i],
                                              value: b[i]});
            }

            // console.log(top_artists_popularity);
            //console.log(top_tracks_popularity);
            // console.log(top_release_dates_count);
            // console.log(top_track_release_dates);
            //console.log(top_track_inst);
            //console.log(top_track_features);
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

router.get('/refresh_token', function(req, res) {

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

function compare(a,b) {
  if (a.val > b.val)
    return -1;
  if (a.val < b.val)
    return 1;
  return 0;
}

module.exports = router;