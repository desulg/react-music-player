import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddSongs from '../components/AddSongs';
import SongList from '../components/SongList';
import NowPlaying from '../components/NowPlaying';
import AddCommentCueForm from '../components/AddCommentCueForm';
import {
  togglePlaying, nowPlayingPage, addSongs, addCue, addComment,
} from '../actions';

const mapDispatchToProps = dispatch => ({
  toggle: playState => dispatch(togglePlaying(playState)),
  openNowPlaying: () => dispatch(nowPlayingPage()),
  addSongs: songs => dispatch(addSongs(songs)),
  addCue: cue => dispatch(addCue(cue)),
  addComment: comment => dispatch(addComment(comment)),
});

class MainView extends Component {
  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
  };

  render() {
    const {
      songs, playState, openNowPlaying, openSnackbar, currentTime,
      addSongs: add, toggle, seconds, duration,
    } = this.props;
    // console.log('sekooonds 2', seconds);
    return (
      <div
        onDragOver={this.handleDragOver}
        onDrop={(event) => {
          this.handleDragOver(event);
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            const files = [...event.dataTransfer.files].filter(({ name }) => name && name.endsWith('.mp3'));
            if (files.length > 0) add(files);
          } else {
            openSnackbar('The File APIs are not fully supported in this browser.');
          }
          return false;
        }}
      >
        <SongList songs={songs} />
        <AddSongs />

        <div className="song-list">
          <AddCommentCueForm
            playingSong={songs[playState.songId]}
            songId={playState.songId}
            seconds={seconds}
            duration={duration}
            currentTime={currentTime}
          />
          <NowPlaying
            togglePlaying={toggle}
            playState={playState}
            playingSong={songs[playState.songId]}
            openNowPlaying={openNowPlaying}
            currentTime={currentTime}
            seconds={seconds}
          />
        </div>
      </div>
    );
  }
}

MainView.propTypes = {
  openNowPlaying: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  addSongs: PropTypes.func.isRequired,
  songs: PropTypes.arrayOf(PropTypes.any).isRequired,
  playState: PropTypes.objectOf(PropTypes.any).isRequired,
  currentTime: PropTypes.number.isRequired,
  openSnackbar: PropTypes.func.isRequired,
  seconds: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default connect(null, mapDispatchToProps)(MainView);
