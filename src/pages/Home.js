import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <div className="text-center py-5 bg-light">
        <Container>
          <h1 className="display-4">Welcome to DTU Blog</h1>
          <p className="lead">
            Share your thoughts, ideas, and experiences with the DTU community.
          </p>
          <div className="mt-4">
            <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg">
              Sign Up
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>📝</span>
                </div>
                <h3>Share Your Thoughts</h3>
                <p>Write blog posts about your experiences, research, or any topic you're passionate about.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>💬</span>
                </div>
                <h3>Engage with Peers</h3>
                <p>Comment on posts, like content, and join discussions with other DTU students and faculty.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>🔔</span>
                </div>
                <h3>Stay Updated</h3>
                <p>Get real-time notifications about new posts, comments, and activities in the community.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="bg-light py-5">
        <Container>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>Connect with the DTU Community</h2>
              <p className="lead">
                Join students, faculty, and alumni in sharing knowledge, experiences, and ideas.
                Whether you're looking for academic collaboration or just want to share your campus
                experiences, DTU Blog is the place to be.
              </p>
              <Button as={Link} to="/register" variant="primary" size="lg">
                Join Now
              </Button>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="bg-primary text-white p-5 rounded text-center">
                <h3>Delhi Technological University</h3>
                <p>Building a Connected Community</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
