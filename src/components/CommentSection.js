import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { commentService } from '../services/api';

function CommentSection({ postId, comments: initialComments, onSubmit, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    
    setLoading(true);
    try {
      const newComment = await commentService.createComment(postId, { text: commentText });
      setComments([newComment, ...comments]);
      setCommentText('');
      if (onSubmit) onSubmit(newComment);
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      {currentUser && (
        <Form onSubmit={handleSubmit} className="mb-3">
          <InputGroup>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading || !commentText.trim()}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </InputGroup>
        </Form>
      )}
      
      <ListGroup variant="flush">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <ListGroup.Item key={comment.id} className="border-0 px-0">
              <div className="d-flex">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                     style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                  {comment.author?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-grow-1">
                  <div className="bg-light p-2 rounded">
                    <strong>{comment.author?.name || 'Unknown'}</strong>
                    <div>{comment.text}</div>
                  </div>
                  <div className="text-muted small ms-2 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <div className="text-muted text-center py-3">
            No comments yet. Be the first to comment!
          </div>
        )}
      </ListGroup>
    </div>
  );
}

export default CommentSection;
