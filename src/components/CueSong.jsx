import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// create cueSong action
import { addCue, removeCue } from '../actions';

class CueSong extends Component {
  cueSong = (e) => {
    console.log('EEE', e);
    console.log('props', this.props);
  }

  render() {
    return (
      <Fab
        color="secondary"
        aria-label="Edit"
        component="label"
        htmlFor="cue-song"
        style={{
          position: 'fixed', bottom: '170px', right: '100px', zIndex: 3000,
        }}
      >
        <input
          style={{ display: 'none' }}
          id="edit-song"
          onChange={this.cueSong}
          type="text"
          multiple
          accept="audio/mp3"
        />
        <EditIcon />
      </Fab>
    );
  }
}

CueSong.propTypes = {
  // cueSong: PropTypes.func.isRequired,
};

export default CueSong;
