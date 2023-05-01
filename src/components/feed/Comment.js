import React from "react";
import styled from "styled-components";
import { FatText } from "../shared";
import PropTypes from "prop-types";

//import sanitizeHtml from "sanitize-html";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($deleteCommentId: Int!) {
    deleteComment(id: $deleteCommentId) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  display: flex;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({ id, author, payload, isMine, photoId }) {
  const deleteCommentUpdate = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: deleteCommentUpdate,
    variables: {
      deleteCommentId: id,
    },
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };

  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? <button onClick={onDeleteClick}>삭제버튼</button> : null}
    </CommentContainer>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string,
  isMine: PropTypes.bool,
  photoId: PropTypes.number,
};

export default Comment;
