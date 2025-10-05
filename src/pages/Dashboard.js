import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BlogEditor from '../components/BlogEditor';
import BlogPost from '../components/BlogPost';
import { blogService } from '../services/api';

function Dashboard() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = async (postData) => {
    try {
      const newPost = await blogService.createPost(postData);
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await blogService.likePost(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (comment) => {
    // Comment is handled within CommentSection component
    fetchPosts(); // Refresh posts to get updated comment count
  };

  const myPosts = posts.filter(post => post.author?.id === currentUser?.id);

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="mb-4">Dashboard</h2>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="feed" title="Feed">
              <BlogEditor onPostCreated={handlePostCreated} />
              
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
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
                  <p>Be the first to create a post!</p>
                </div>
              )}
            </Tab>
            
            <Tab eventKey="my-posts" title="My Posts">
              <h4 className="mb-3">My Posts</h4>
              {myPosts.length > 0 ? (
                myPosts.map(post => (
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
                  <h4>You haven't created any posts yet</h4>
                  <p>Create your first post to get started!</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
