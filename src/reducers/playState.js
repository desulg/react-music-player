import { PLAY_SONG, TOGGLE_PLAYING, PLAY_FROM_TIME } from '../actions/index';

const initalState = {
  playing: false,
  songId: -1,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case PLAY_SONG: {
      return { playing: true, songId: action.id, currentTime: 0 };
    }
    case PLAY_FROM_TIME: {
      const currTime = action.commentCue.currentTime;
      const id = action.commentCue.songId;
      let commentCue = {};
      if (action.commentCue.comment) {
        commentCue = {
          playing: true,
          songId: id,
          currentTime: currTime,
          comment: action.commentCue.comment,
          seconds: action.commentCue.seconds,
          duration: action.commentCue.duration,
        };
      } else {
        commentCue = {
          playing: true,
          songId: id,
          currentTime: currTime,
          seconds: action.commentCue.seconds,
          duration: action.commentCue.duration,
        };
      }
      return commentCue;
    }
    case TOGGLE_PLAYING: {
      return Object.assign({}, state, {
        playing: !state.playing,
        currentTime: action.toggleState.currentTime,
        seconds: action.toggleState.seconds,
      });
    }
    default: {
      return state;
    }
  }
};
