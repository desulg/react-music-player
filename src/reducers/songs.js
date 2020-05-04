import update from 'immutability-helper';
import {
  ADD_SONGS, REMOVE_SONGS, ADD_COMMENT, ADD_CUE,
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case ADD_SONGS: {
      return [...state, ...action.songs];
    }
    case REMOVE_SONGS: {
      return state.filter((song, index) => index !== action.id);
    }
    case ADD_COMMENT: {
      let stateComments = state.comments;
      if (!stateComments) {
        stateComments = [];
      }
      const newCommentArray = update(state, { comments: { $push: [action.comment] } });
      console.log('addComment reducer newCommentArray', newCommentArray);
      return newCommentArray;
    }
    case ADD_CUE: {
      let stateCues = state.cue;
      if (!stateCues) {
        stateCues = [];
      }
      const newCueArray = update(state, { cues: { $push: [action.cue] } });
      console.log('addCue reducer newCueArray', newCueArray);
      return newCueArray;
    }
    default: {
      return state;
    }
  }
};
