import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import MoreVert from '@material-ui/icons/MoreVert';
import CommentIcon from '@material-ui/icons/Comment';

const Comment = ({ comment, handleClick, handleIconClick }) => {
  const minutes = Math.floor(comment.seconds / 60);
  const remainingSeconds = comment.seconds - minutes * 60;
  return (
    <ListItem className="comment" onClick={handleClick}>
      <ListItemAvatar className="comment-list-item-avatar">
        <Avatar>
          <CommentIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={comment.comment}
        secondary={`Ajatempel: ${minutes}:${remainingSeconds}`}
      />
      <ListItemSecondaryAction onClick={handleIconClick}>
        <IconButton aria-label="Delete">
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
  handleIconClick: PropTypes.func.isRequired,
};
export default Comment;
