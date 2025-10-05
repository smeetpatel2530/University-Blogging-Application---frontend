import React, { useState } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { fileService } from '../services/api';

function BlogEditor({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fileService.uploadFile(file);
      setMediaUrls([...mediaUrls, response.fileUrl]);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        title,
        content,
        category: category || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : null
      };

      await onPostCreated(postData);
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setTags('');
      setMediaUrls([]);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (index) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">Create a New Post</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tags (comma-separated, optional)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Form.Text className="text-muted">
              Example: technology, research, campus-life
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Upload Media (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*"
            />
            {uploading && <small className="text-muted">Uploading...</small>}
          </Form.Group>
          
          {mediaUrls.length > 0 && (
            <div className="mb-3">
              <h6>Attachments:</h6>
              <div className="d-flex flex-wrap gap-2">
                {mediaUrls.map((url, index) => (
                  <Badge key={index} bg="secondary" className="d-flex align-items-center">
                    Media {index + 1}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: '0.6rem' }}
                      onClick={() => removeMedia(index)}
                    ></button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BlogEditor;
