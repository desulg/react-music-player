import React from 'react';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import PropTypes from 'prop-types';

import Song from './Song';

const SongList = ({ openSnackbar, songs }) => {
  if (!songs[0]) {
    return (
      <h4 style={{ fontWeight: 300, textAlign: 'center' }}>No Songs Present. Please Add Songs</h4>
    );
  }
  return (
    <div style={{ marginBottom: '100px' }}>
      <List>
        {
          songs.map((song, ind) => (
            <div key={`song-${song.lastModified}-${song.size}`}>
              <Song openSnackbar={openSnackbar} song={song} index={ind} />
              <Divider key={song.lastModified} />
            </div>
          ))
        }
      </List>
    </div>
  );
};

SongList.propTypes = {
  openSnackbar: PropTypes.func.isRequired,
  songs: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default SongList;
