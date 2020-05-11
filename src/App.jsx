import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { NOW_PLAYING_PAGE, togglePlaying, playSong } from './actions';

import MainView from './views/MainView';
import Header from './components/Header';
import PlayingView from './views/PlayingView';
import keyboardEvents from './utils/keyboardEvents';

const mapStateToProps = state => ({
  page: state.page,
  songs: state.songs,
  playState: state.playState,
  repeatType: state.common.repeat,
});

const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(togglePlaying()),
  playSong: id => dispatch(playSong(id)),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      playFromTimeSeconds: 0,
      running: false,
      currentTime: 0,
      elapsedTime: 0,
      duration: 0,
      snackBarOpen: false,
      hasRejectedInstall: false,
      snackMsg: '',
      hideSnackAction: false,
      installEvent: null,
      addToHomeScreenUIVisible: false,
      commentDisplayCount: 0,
    };
  }

  componentDidMount() {
    const { songs, toggle } = this.props;
    this.interval = setInterval(this.updateTime);
    if (songs[0]) {
      this.audioPlayer.src = URL.createObjectURL(songs[0]);
    }
    this.releaseKeyboardEvents = keyboardEvents({
      playNext: this.playNext,
      playPrevious: this.playPrevious,
      togglePlaying: toggle,
    });
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState({ installEvent: e, addToHomeScreenUIVisible: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { playState } = this.props;
    const { installEvent, hasRejectedInstall } = this.state;
    if (nextProps.playState !== playState) {
      if (!nextProps.playState.playing) {
        // PAUSE
        this.audioPlayer.pause();
        this.setState(prevState => ({
          running: false,
          playFromTimeSeconds: nextProps.playState.seconds,
          elapsedTime: prevState.elapsedTime,
        }));
      } else if (nextProps.playState.songId === -1) {
        this.playSong(0);
        // RESUME
      } else if (nextProps.playState.songId === playState.songId) {
        const resumeFrom = {
          time: nextProps.playState.currentTime,
          seconds: nextProps.playState.seconds,
          duration: nextProps.playState.duration,
        };
        this.playFromTime(resumeFrom);
        // Start playing from comment
      } else if (nextProps.playState.currentTime > 0) {
        let commentCue = {};
        if (nextProps.playState.comment) {
          commentCue = {
            comment: nextProps.playState.comment,
            time: nextProps.playState.currentTime,
            seconds: nextProps.playState.seconds,
            duration: nextProps.playState.duration,
          };
        } else {
          commentCue = {
            time: nextProps.playState.currentTime,
            seconds: nextProps.playState.seconds,
            duration: nextProps.playState.duration,
          };
        }
        if (nextProps.playState.songId !== playState.songId) {
          const { songs } = this.props;
          const id = nextProps.playState.songId;
          if (songs[id]) {
            const fileSrc = URL.createObjectURL(songs[id]);
            this.audioPlayer.src = fileSrc;
            // this.audioPlayer.play();
            window.document.title = songs[id].name.replace('.mp3', '');
          }
          // Object.assign(commentCue, { songId: nextProps.playState.songId });
        }
        this.playFromTime(commentCue);
        // Start playing
      } else {
        this.setState({
          running: true,
          previousTime: Date.now(),
        });
        this.playSong(nextProps.playState.songId);
      }
      if (installEvent && !hasRejectedInstall) {
        installEvent.prompt();
        installEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.setState({
              snackBarOpen: true,
              hideSnackAction: true,
              hasRejectedInstall: false,
              snackMsg: '🤗 Yay! You\'ve installed the app',
            });
          } else {
            this.setState({
              snackBarOpen: true,
              hideSnackAction: true,
              hasRejectedInstall: true,
              snackMsg: '😥 Reload the page whenever you change your mind',
            });
          }
          this.snackBarOpen({ installEvent: null });
        });
      }
    }
  }

  componentWillUnmount() {
    this.releaseKeyboardEvents();
    clearInterval(this.interval);
  }

  playNext = () => {
    const { songs, playState, playSong: play } = this.props;
    URL.revokeObjectURL(songs[playState.songId]);
    const nextSongId = (playState.songId + 1) % songs.length;
    play(nextSongId);
  }

  songEnded = () => {
    const {
      songs, playState, repeatType, playSong: play,
    } = this.props;
    // No repeat
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
      seconds: 0,
      duration: 0,
      playFromTimeSeconds: 0,
    });
    if (repeatType === 0) {
      URL.revokeObjectURL(songs[playState.songId]);
      if (playState.songId < songs.length - 1) play(playState.songId + 1);
    // repeat one
    } else if (repeatType === 1) {
      play(playState.songId);
    // repeat all
    } else this.playNext();
  }

  playPrevious = () => {
    const { songs, playState, playSong: play } = this.props;
    URL.revokeObjectURL(songs[playState.songId]);
    const prevSongId = playState.songId === 0 ? songs.length - 1 : playState.songId - 1;
    play(prevSongId);
  }

  playFromTime = (commentCue) => {
    this.setState({
      previousTime: Date.now(),
      running: true,
      playFromTimeSeconds: commentCue.seconds,
      elapsedTime: 0,
      duration: commentCue.duration,
      seconds: commentCue.seconds,
      currentTime: commentCue.time,
    });
    if (commentCue.comment) {
      this.displayComment(commentCue.comment);
    }

    this.audioPlayer.currentTime = (commentCue.time / 100) * commentCue.duration;
    this.audioPlayer.play();
  }

  updateTime = () => {
    if (this.state.running) {
      const now = Date.now();
      this.setState(prevState => ({
        elapsedTime: prevState.elapsedTime + (now - prevState.previousTime),
        previousTime: Date.now(),
        seconds: prevState.playFromTimeSeconds + Math.floor(prevState.elapsedTime / 1000),
        currentTime: 100 * this.audioPlayer.currentTime / this.audioPlayer.duration || 0,
        duration: this.audioPlayer.duration,
      }));
    }
  }

  playSong = (id) => {
    const { songs } = this.props;
    if (songs[id]) {
      const fileSrc = URL.createObjectURL(songs[id]);
      this.audioPlayer.src = fileSrc;
      this.audioPlayer.play();
      window.document.title = songs[id].name.replace('.mp3', '');
    }
  }

  timeDrag = (time) => {
    this.audioPlayer.currentTime = this.audioPlayer.duration * (time / 100);
  }

  handleActionClick = () => {
    window.open('https://github.com/ashinzekene/react-music-player', '_blank');
  }

  handleRequestClose = () => {
    this.setState({
      snackBarOpen: false,
      snackMsg: '',
      hideSnackAction: false,
      commentDisplayCount: 0,
    });
  }

  displayComment = (comment) => {
    this.setState({
      commentDisplayCount: 1,
      snackBarOpen: true,
      hideSnackAction: true,
      snackMsg: comment,
    });
  }

  render() {
    const {
      currentTime, snackBarOpen, snackMsg, installEvent, addToHomeScreenUIVisible, hideSnackAction,
      seconds, running, commentDisplayCount, duration,
    } = this.state;
    const {
      songs, playState, toggle, repeatType, page,
    } = this.props;

    if (running === true && songs.comments) {
      const playingSongLastModified = songs[playState.songId].lastModified;
      songs.comments.map((comment) => {
        if (comment.songId === playingSongLastModified) {
          if (comment.seconds === seconds && commentDisplayCount === 0) {
            this.displayComment(comment.comment);
          }
        }
      });
    }
    return (
      <>
        <Header
          playState={playState}
          addToHomeScreenUIVisible={addToHomeScreenUIVisible}
          playingSong={songs[playState.songId]}
          openSnackbar={() => this.setState({ snackBarOpen: true })}
        />
        <audio
          hidden
          controls
          onEnded={this.songEnded}
          onTimeUpdate={this.updateTime}
          ref={(audio) => { this.audioPlayer = audio; }}
        >
          <track kind="captions" {...{}} />
        </audio>
        {
          page === NOW_PLAYING_PAGE ? (
            <PlayingView
              repeatType={repeatType}
              playNext={this.playNext}
              timeDrag={this.timeDrag}
              installEvent={installEvent}
              currentTime={currentTime}
              seconds={seconds}
              playPrevious={this.playPrevious}
              playingSong={songs[playState.songId]}
              openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })}
            />
          ) : (
            <MainView
              songs={songs}
              toggle={toggle}
              playState={playState}
              seconds={seconds}
              duration={duration}
              currentTime={currentTime}
              openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })}
            />
          )}
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleRequestClose}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={(
            <span id="message-id">{snackMsg || 'Not Implemented yet 😊'}</span>
          )}
          action={
            !hideSnackAction && (
              <Button key="undo" color="secondary" size="small" onClick={this.handleActionClick}>
                MAKE A PR
              </Button>
            )}
        />
      </>
    );
  }
}

App.propTypes = {
  page: PropTypes.string.isRequired,
  songs: PropTypes.arrayOf(PropTypes.any).isRequired,
  playState: PropTypes.shape({
    playing: PropTypes.bool.isRequired,
    songId: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    comment: PropTypes.string,
  }).isRequired,
  repeatType: PropTypes.oneOf([0, 1, 2]).isRequired,
  toggle: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
