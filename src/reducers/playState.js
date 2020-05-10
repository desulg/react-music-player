import { PLAY_SONG, TOGGLE_PLAYING, PLAY_FROM_COMMENT } from '../actions/index';

const initalState = {
  playing: false,
  songId: -1,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case PLAY_SONG: {
      return { playing: true, songId: action.id, currentTime: 0 };
    }
    case PLAY_FROM_COMMENT: {
      const currTime = action.comment.currentTime;
      const id = action.comment.songId;
      const commentTime = {
        playing: true,
        songId: id,
        currentTime: currTime,
        comment: action.comment.comment,
        seconds: action.comment.seconds,
      };
      return commentTime;
    }
    case TOGGLE_PLAYING: {
      // Handle seconds here maybe?
      console.log(action);
      // const playState = {
      //   currentTime: action.toggleState.currentTime,
      //   seconds: action.toggleState.seconds,
      //   playing: !state.playing,
      // };
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
