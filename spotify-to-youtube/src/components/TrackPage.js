import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './TrackPage.css';

function TrackPage({ accessToken, playlistId, playlistName, onBack }) {
   const [tracks, setTracks] = useState([]);
   const [youtubeResults, setYoutubeResults] = useState([]);

   const fetchPlaylistTracks = useCallback(async () => {
       const response = await axios.get('https://crossplatformplaylist-spotify2yt.up.railway.app/playlist-tracks', {
           params: { access_token: accessToken, playlist_id: playlistId },
       });
       const tracksWithCovers = response.data.map((track) => ({
           ...track,
           cover: track.cover || 'https://via.placeholder.com/60',
       }));
       setTracks(tracksWithCovers);
   }, [accessToken, playlistId]);

   useEffect(() => {
       fetchPlaylistTracks();
   }, [fetchPlaylistTracks]);

   const searchYouTube = async (track) => {
       const query = `${track.name} ${track.artist}`;
       const response = await axios.get(`https://crossplatformplaylist-spotify2yt.up.railway.app/youtube-search`, {
           params: { q: query },
       });
       return response.data;
   };

   const fetchYouTubeResults = async () => {
       const results = await Promise.all(tracks.map((track) => searchYouTube(track)));
       setYoutubeResults(results);
   };

   return (
       <div className="track-page">
           <div className="breadcrumb">
               <span className="breadcrumb-item" onClick={onBack}>Playlists</span>
               {' > '}
               <span className="breadcrumb-item active">{playlistName}</span>
           </div>
           <h2>{playlistName} - Track List</h2>
           <button className="search-button" onClick={fetchYouTubeResults}>Search YouTube</button>
           <ul className="track-list">
               {tracks.map((track, index) => (
                   <li key={index}>
                       <img src={track.cover} alt={track.name} className="track-cover" />
                       <div className="track-info">
                           <p className="track-title">{track.name}</p>
                           <p className="track-artist">by {track.artist}</p>
                       </div>
                       {youtubeResults[index] && (
                           <a
                               href={`https://www.youtube.com/watch?v=${youtubeResults[index].id.videoId}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="youtube-link"
                           >
                               Watch on YouTube
                           </a>
                       )}
                   </li>
               ))}
           </ul>
       </div>
   );
}

export default TrackPage;