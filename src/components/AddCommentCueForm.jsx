import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment, addCue } from '../actions';

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
    if (this.props.songId !== -1) {
      if (this.state.comment === '') {
        this.addCue();
      }
      if (this.state.comment !== '') {
        this.addComment();
      }
    }
  };

  addCue = (e) => {
    if (e) e.preventDefault();
    const cue = {
      songId: this.props.playingSong.lastModified,
      currentTime: this.props.currentTime,
      seconds: this.props.seconds,
      duration: this.props.duration,
    };
    this.props.addCue(cue);
  };


  addComment = (e) => {
    if (e) e.preventDefault();
    const comment = {
      comment: this.state.comment,
      songId: this.props.playingSong.lastModified,
      currentTime: this.props.currentTime,
      seconds: this.props.seconds,
      duration: this.props.duration,
    };
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
  duration: PropTypes.number.isRequired,
  addCue: PropTypes.func.isRequired,
};

AddCommentCueForm.defaultProps = {
  playingSong: null,
};

export default connect(null, mapDispatchToProps)(AddCommentCueForm);
