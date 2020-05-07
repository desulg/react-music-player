/* eslint linebreak-style: ["error", "windows"] */
import mediaSession from '../utils/media-session';

export const ADD_SONGS = 'ADD_SONGS';
export const REMOVE_SONGS = 'REMOVE_SONGS';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const FILTER_SONGS = 'FILTER_SONGS';
export const PLAY_SONG = 'PLAY_SONG';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const PLAYLIST_PAGE = 'PLAYLIST_PAGE';
export const SHUFFLE = 'SHUFFLE';
export const REPEAT = 'REPEAT';
export const HOME_PAGE = 'HOME_PAGE';
export const SETTINGS_PAGE = 'SETTINGS_PAGE';
export const NOW_PLAYING_PAGE = 'NOW_PLAYING_PAGE';
export const ADD_CUE = 'ADD_CUE';
export const REMOVE_CUE = 'REMOVE_CUE';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const PLAY_FROM_COMMENT = 'PLAY_FROM_COMMENT';


export const addSongs = songs => ({
  type: ADD_SONGS,
  songs,
});

export const removeSong = id => ({
  type: REMOVE_SONGS,
  id,
});

export const playSong = (id) => {
  mediaSession.playSong(id);
  return {
    type: PLAY_SONG,
    id,
  };
};

export const repeatType = id => ({
  type: REPEAT,
  id,
});

export const togglePlaying = () => ({
  type: TOGGLE_PLAYING,
});

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

export const filterSong = filter => ({
  type: FILTER_SONGS,
  filter,
});

export const homePage = () => ({
  type: HOME_PAGE,
});

export const nowPlayingPage = () => ({
  type: NOW_PLAYING_PAGE,
});

export const settingsPage = () => ({
  type: SETTINGS_PAGE,
});

export const addCue = cue => ({
  type: ADD_CUE,
  cue,
});

export const removeCue = id => ({
  type: REMOVE_CUE,
  id,
});

export const addComment = comment => ({
  type: ADD_COMMENT,
  comment,
});

export const removeComment = id => ({
  type: REMOVE_COMMENT,
  id,
});

export const playFromComment = comment => ({
  type: PLAY_FROM_COMMENT,
  comment,
});
