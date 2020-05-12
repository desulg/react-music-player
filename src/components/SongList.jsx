import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  removeSong, playSong, playFromTime, removeComment, removeCue,
} from '../actions';
import Song from './Song';
import Comment from './Comment';
import Cue from './Cue';

const mapDispatchToProps = dispatch => ({
  remove: id => dispatch(removeSong(id)),
  play: id => dispatch(playSong(id)),
  commentCuePlay: commentCue => dispatch(playFromTime(commentCue)),
  commentRemove: id => dispatch(removeComment(id)),
  cueRemove: id => dispatch(removeCue(id)),
});

const SongList = ({
  songs, remove, play, commentRemove, commentCuePlay, cueRemove,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [activeSong, setActiveSong] = useState(-1);

  const [activeComment, setActiveComment] = useState(-1);

  const [activeCue, setActiveCue] = useState(-1);

  const setActiveItem = (item, ind) => ({ target }) => {
    if (item.comment) {
      setAnchorEl(target);
      setActiveComment(ind);
    } else if (item.size) {
      setAnchorEl(target);
      setActiveSong(ind);
    } else {
      setAnchorEl(target);
      setActiveCue(ind);
    }
  };

  const removeItem = () => {
    if (activeSong !== -1) {
      remove(activeSong);
      setActiveSong(-1);
      setAnchorEl(null);
    } else if (activeComment !== -1) {
      commentRemove(activeComment);
      setActiveComment(-1);
      setAnchorEl(null);
    } else if (activeCue !== -1) {
      cueRemove(activeComment);
      setActiveCue(-1);
      setAnchorEl(null);
    }
  };

  const handleSongClick = ind => () => play(ind);
  const handleCommentClick = (comment, songInd) => () => {
    const commentAndSongInd = {
      comment: comment.comment,
      currentTime: comment.currentTime,
      seconds: comment.seconds,
      songId: songInd,
      duration: comment.duration,
    };
    commentCuePlay(commentAndSongInd);
  };

  const handleCueClick = (cue, songInd) => () => {
    const commentAndSongInd = {
      currentTime: cue.currentTime,
      seconds: cue.seconds,
      songId: songInd,
      duration: cue.duration,
    };
    commentCuePlay(commentAndSongInd);
  };

  if (!songs.length) {
    return (
      <h4 style={{ fontWeight: 300, textAlign: 'center' }}>Lugusid ei ole. Palun lisage lood</h4>
    );
  }
  if (songs.comments && songs.cues) {
    return (
      <div className="song-list">
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => removeItem()}>Remove Item</MenuItem>
        </Menu>
        <List>
          {
            songs.map((song, songInd) => (
              [
                <Song
                  key={`song-${song.lastModifiedDate}`}
                  handleClick={handleSongClick(songInd)}
                  handleIconClick={setActiveItem(song, songInd)}
                  song={song}
                />,
                <Divider key={`divider-${song.lastModifiedDate}`} />,
                songs.comments.map((comment, commentInd) => {
                  if (comment.songId === song.lastModified) {
                    return (
                      [
                        <Comment
                          key={`comment-${comment.comment}`}
                          handleClick={handleCommentClick(comment, songInd)}
                          handleIconClick={setActiveItem(comment, commentInd)}
                          comment={comment}
                        />,
                        <Divider key={`divider-${comment.comment}`} />,
                      ]
                    );
                  }
                }),
                songs.cues.map((cue, cueInd) => {
                  if (cue.songId === song.lastModified) {
                    return (
                      [
                        <Cue
                          key={`cue-${cue.songId}`}
                          handleClick={handleCueClick(cue, songInd)}
                          handleIconClick={setActiveItem(cue, cueInd)}
                          cue={cue}
                        />,
                        <Divider key={`divider-${cue.songId}`} />,
                      ]
                    );
                  }
                }),
              ]
            ))
          }
        </List>
      </div>
    );
  }
  if (songs.cues) {
    return (
      <div className="song-list">
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => removeItem()}>Remove Item</MenuItem>
        </Menu>
        <List>
          {
            songs.map((song, songInd) => (
              [
                <Song
                  key={`song-${song.lastModifiedDate}`}
                  handleClick={handleSongClick(songInd)}
                  handleIconClick={setActiveItem(song, songInd)}
                  song={song}
                />,
                <Divider key={`divider-${song.lastModifiedDate}`} />,
                songs.cues.map((cue, cueInd) => {
                  if (cue.songId === song.lastModified) {
                    return (
                      [
                        <Cue
                          key={`cue-${cue.songId}`}
                          handleClick={handleCommentClick(cue, songInd)}
                          handleIconClick={setActiveItem(cue, cueInd)}
                          cue={cue}
                        />,
                        <Divider key={`divider-${cue.songId}`} />,
                      ]
                    );
                  }
                }),
              ]
            ))
          }
        </List>
      </div>
    );
  }
  if (songs.comments) {
    return (
      <div className="song-list">
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => removeItem()}>Remove Item</MenuItem>
        </Menu>
        <List>
          {
            songs.map((song, songInd) => (
              [
                <Song
                  key={`song-${song.lastModifiedDate}`}
                  handleClick={handleSongClick(songInd)}
                  handleIconClick={setActiveItem(song, songInd)}
                  song={song}
                />,
                <Divider key={`divider-${song.lastModifiedDate}`} />,
                songs.comments.map((comment, commentInd) => {
                  if (comment.songId === song.lastModified) {
                    return (
                      [
                        <Comment
                          key={`comment-${comment.comment}`}
                          handleClick={handleCommentClick(comment, songInd)}
                          handleIconClick={setActiveItem(comment, commentInd)}
                          comment={comment}
                        />,
                        <Divider key={`divider-${comment.comment}`} />,
                      ]
                    );
                  }
                }),
              ]
            ))
          }
        </List>
      </div>
    );
  }
  return (
    <div style={{ bottom: '130px' }}>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => removeItem()}>Remove Song</MenuItem>
      </Menu>
      <List>
        {
          songs.map((song, songInd) => (
            [
              <Song
                key={`song-${song.lastModifiedDate}`}
                handleClick={handleSongClick(songInd)}
                handleIconClick={setActiveItem(song, songInd)}
                song={song}
              />,
              <Divider key={`divider-${song.lastModifiedDate}`} />,
            ]
          ))
        }
      </List>
    </div>
  );
};

SongList.propTypes = {
  remove: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  songs: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  commentRemove: PropTypes.func.isRequired,
  commentCuePlay: PropTypes.func.isRequired,
  cueRemove: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SongList);
