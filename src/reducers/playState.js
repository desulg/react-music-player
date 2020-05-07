import { PLAY_SONG, TOGGLE_PLAYING, PLAY_FROM_COMMENT } from '../actions/index';

const initalState = {
  playing: false,
  songId: -1,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case PLAY_SONG: {
      return { playing: true, songId: action.id };
    }
    case PLAY_FROM_COMMENT: {
      console.log('state', state);
      console.log('action', action);
      return { playing: true };
    }
    case TOGGLE_PLAYING: {
      return Object.assign({}, state, { playing: !state.playing });
    }
    default: {
      return state;
    }
  }
};
