// src/apiUtils.js
const CLIENT_ID = "7a507811507a40808833cf3ba9962c96";
const CLIENT_SECRET = "2c86fd15ef1a41b4a58d082b8cfd135a";

export const fetchAccessToken = async () => {
  const authParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
  const data = await response.json();
  if (data.access_token) {
    return data.access_token;
  } else {
    throw new Error('Failed to obtain access token');
  }
};

export const searchTracks = async (accessToken, searchTerm) => {
  const searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
  };

  const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, searchParameters);
  const data = await response.json();
  if (data.tracks) {
    return data.tracks.items;
  } else {
    throw new Error('Failed to fetch tracks');
  }
};
