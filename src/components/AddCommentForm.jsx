import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../actions';

const mapDispatchToProps = dispatch => ({
  addComment: comment => dispatch(addComment(comment)),
});

class AddCommentForm extends Component {
  state = {
    comment: '',
  };


  onCommentChange = (e) => {
    const comment = e.target.value;
    this.setState({ comment });
  };

  addComment = (e) => {
    console.log('addCommentForm  this', this);
    if (e) e.preventDefault();
    if (this.props.songId === -1) {
      console.log('SongId is -1 select a song, can use snackbar maybe');
    } else {
      const comment = {
        comment: this.state.comment,
        songId: this.props.songId,
        currentTime: this.props.currentTime,
      };
      this.props.addComment(comment);
    }
    this.setState({ comment: '' });
  };

  render() {
    return (
      <div className="add-comment-form add-comment-container">
        <form onSubmit={this.addComment}>
          <input
            type="text"
            // eslint-disable-next-line
            value={this.state.comment}
            onChange={this.onCommentChange}
            placeholder="Add Comment..."
          />
          <input type="submit" value="Add Comment" />
        </form>
      </div>
    );
  }
}

AddCommentForm.propTypes = {
  currentTime: propTypes.number.isRequired,
  songId: propTypes.number.isRequired,
  addComment: propTypes.func.isRequired,
};
export default connect(null, mapDispatchToProps)(AddCommentForm);
