import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BlogPost from '../components/BlogPost';
import { blogService } from '../services/api';

function CommunityFeed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    // Optimistic UI update for a faster feel
    const originalPosts = [...posts];
    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            const isLiked = p.likedByUserIds.includes(currentUser?.id);
            const newLikedIds = isLiked 
                ? p.likedByUserIds.filter(id => id !== currentUser.id)
                : [...p.likedByUserIds, currentUser.id];
            return { ...p, likedByUserIds: newLikedIds, likeCount: newLikedIds.length };
        }
        return p;
    });
    setPosts(updatedPosts);

    // Actual API call
    try {
        await blogService.likePost(postId);
    } catch (error) {
        console.error('Failed to like post:', error);
        // Rollback on error
        setPosts(originalPosts);
    }
  };

  const handleComment = () => {
    // Re-fetch posts to get the latest comment count
    fetchPosts(); 
  };


  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4 text-center">Community Feed</h1>
          <p className="text-center text-muted mb-5">See what everyone in the DTU community is talking about.</p>

          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <BlogPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                currentUser={currentUser}
              />
            ))
          ) : (
            <div className="text-center py-5">
              <h4>No posts yet</h4>
              <p>Be the first to create a post from your dashboard!</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CommunityFeed;
