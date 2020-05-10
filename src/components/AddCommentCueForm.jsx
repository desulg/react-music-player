import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment, addCue } from '../actions';
// import Paper from '@material-ui/core/Paper';

const mapDispatchToProps = dispatch => ({
  addComment: comment => dispatch(addComment(comment)),
  addCue: cue => dispatch(addCue(cue)),
});

class AddCommentCueForm extends Component {
  state = {
    comment: '',
    buttonText: 'Add Cue',
  };

  onCommentChange = (e) => {
    const commentText = e.target.value;
    if (commentText !== '') {
      this.setState({
        comment: commentText,
        buttonText: 'Add Comment',
      });
    } else {
      this.setState({
        comment: commentText,
        buttonText: 'Add Cue',
      });
    }
  };

  addCommentOrCue = (e) => {
    if (e) e.preventDefault();
    if (this.props.songId === -1) {
      console.log('SongId is -1 select a song, can use snackbar maybe');
    } else {
      if (this.state.comment === '') {
        this.addCue();
      }
      if (this.state.comment !== '') {
        this.addComment();
      }
    }
  };

  addCue = (e) => {
    console.log('CUEEEEEE', this.props);
    if (e) e.preventDefault();
    const cue = {
      songId: this.props.playingSong.lastModified,
      currentTime: this.props.currentTime,
      seconds: this.props.seconds,
    };
    this.props.addCue(cue);
  };


  addComment = (e) => {
    console.log('COOMMMEENT', this.props);
    console.log('COOMMMEENT2222222', this.state);
    if (e) e.preventDefault();
    const comment = {
      comment: this.state.comment,
      songId: this.props.playingSong.lastModified,
      currentTime: this.props.currentTime,
      seconds: this.props.seconds,
    };
    console.log('addcomment comment', comment);
    this.props.addComment(comment);
    this.setState({
      comment: '',
      buttonText: 'Add Cue',
    });
  };

  render() {
    return (
      <div className="add-comment-form add-comment-container">
        <form onSubmit={this.addCommentOrCue}>
          <input
            type="text"
            // eslint-disable-next-line
            value={this.state.comment}
            onChange={this.onCommentChange}
            placeholder="Add Comment..."
          />
          <input type="submit" value={this.state.buttonText} />
        </form>
      </div>
    );
  }
}

AddCommentCueForm.propTypes = {
  currentTime: PropTypes.number.isRequired,
  songId: PropTypes.number.isRequired,
  addComment: PropTypes.func.isRequired,
  playingSong: PropTypes.objectOf(PropTypes.any),
  seconds: PropTypes.number.isRequired,
  addCue: PropTypes.func.isRequired,
};

AddCommentCueForm.defaultProps = {
  playingSong: null,
};

export default connect(null, mapDispatchToProps)(AddCommentCueForm);
