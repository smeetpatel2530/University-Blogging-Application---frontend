import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import CommentSection from './CommentSection';

function BlogPost({ post, onLike, onComment, currentUser }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likedByUserIds?.includes(currentUser?.id) || false
  );
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const handleLike = async () => {
    try {
      await onLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <Card className="blog-post-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                 style={{ width: '40px', height: '40px' }}>
              {post.author?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h6 className="mb-0">{post.author?.name || 'Unknown'}</h6>
              <small className="text-muted">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
          {post.category && (
            <Badge bg="info">{post.category}</Badge>
          )}
        </div>
        
        <Card.Title>{post.title}</Card.Title>
        <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Card.Text>
        
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="mb-3">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:8080${url}`}
                alt={`Media ${index + 1}`}
                className="img-fluid rounded mb-2 me-2"
                style={{ maxHeight: '300px' }}
              />
            ))}
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} bg="light" text="dark" className="me-1">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <Button
              variant={isLiked ? 'primary' : 'outline-primary'}
              size="sm"
              className="me-2"
              onClick={handleLike}
              disabled={!currentUser}
            >
              👍 {likeCount}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              💬 {post.comments?.length || 0}
            </Button>
          </div>
        </div>
        
        {showComments && (
          <div className="mt-3">
            <CommentSection
              postId={post.id}
              comments={post.comments || []}
              onSubmit={onComment}
              currentUser={currentUser}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BlogPost;
