import update from 'immutability-helper';
import {
  ADD_SONGS, REMOVE_SONGS, ADD_COMMENT, ADD_CUE, REMOVE_COMMENT, REMOVE_CUE,
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case ADD_SONGS: {
      const songArray = [...state, ...action.songs];
      if (state.comments && state.comments.length > 0) {
        songArray.comments = [...state.comments];
      }
      if (state.cues && state.cues.length > 0) {
        songArray.cues = [...state.cues];
      }
      return songArray;
    }
    case REMOVE_SONGS: {
      let filteredComments; let filteredCues;
      const removedSongLastModified = state[action.id].lastModified;

      if (state.comments && state.comments.length > 0) {
        filteredComments = state.comments.filter(
          comment => comment.songId !== removedSongLastModified,
        );
      }

      if (state.cues && state.cues.length > 0) {
        filteredCues = state.cues.filter(
          cue => cue.songId !== removedSongLastModified,
        );
      }

      const filteredSongs = state.filter(
        (song, index) => index !== action.id,
      );

      if (filteredComments && filteredComments.length > 0) {
        filteredSongs.comments = [...filteredComments];
      }

      if (filteredCues && filteredCues.length > 0) {
        filteredSongs.cues = [...filteredCues];
      }
      return filteredSongs;
    }

    case ADD_COMMENT: {
      if (!state.comments) {
        // eslint-disable-next-line no-param-reassign
        state.comments = [];
      }
      const newCommentArray = update(
        state, { comments: { $push: [action.comment] } },
      );
      return newCommentArray;
    }

    case REMOVE_COMMENT: {
      const newCommentArray = update(
        state, { comments: { $splice: [[action.id, 1]] } },
      );
      return newCommentArray;
    }

    case ADD_CUE: {
      if (!state.cues) {
        // eslint-disable-next-line no-param-reassign
        state.cues = [];
      }
      const newCueArray = update(
        state, { cues: { $push: [action.cue] } },
      );
      return newCueArray;
    }

    case REMOVE_CUE: {
      const newCueArray = update(
        state, { cues: { $splice: [[action.id, 1]] } },
      );
      return newCueArray;
    }

    default: {
      return state;
    }
  }
};
