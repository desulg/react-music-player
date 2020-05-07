import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import connect from 'react-redux/es/connect/connect';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  removeSong, playSong, playFromComment, removeComment,
} from '../actions';
import Song from './Song';
import Comment from './Comment';

const mapDispatchToProps = dispatch => ({
  remove: id => dispatch(removeSong(id)),
  play: id => dispatch(playSong(id)),
  playFromComment: comment => dispatch(playFromComment(comment)),
  commentRemove: id => dispatch(removeComment(id)),
});

const SongList = ({
  songs, remove, play, commentRemove,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [activeSong, setActiveSong] = useState(-1);

  const [activeComment, setActiveComment] = useState(-1);

  const setActiveItem = (item, ind) => ({ target }) => {
    if (item.comment) {
      setAnchorEl(target);
      setActiveComment(ind);
    } else {
      setAnchorEl(target);
      setActiveSong(ind);
    }
  };

  const removeItem = () => {
    if (activeSong !== -1) {
      remove(activeSong);
      setActiveSong(-1);
      setAnchorEl(null);
    } else {
      commentRemove(activeComment);
      setAnchorEl(null);
    }
  };

  const handleSongClick = ind => () => play(ind);
  const handleCommentClick = commentInd => () => playFromComment(commentInd);

  console.log('SongList===>', songs);
  // iterate through comments and add comment to each song and songId should be lastmodifieddate
  if (!songs.length) {
    return (
      <h4 style={{ fontWeight: 300, textAlign: 'center' }}>No Songs Present. Please Add Songs</h4>
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
                          handleClick={handleCommentClick(songInd)}
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
};

export default connect(null, mapDispatchToProps)(SongList);
