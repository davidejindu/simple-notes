import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';
import Navbar from '../componenets/Navbar.jsx';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/notes', { title, content });
      toast.success('Note created successfully');
      navigate('/home');
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast");
      } else {
        toast.error('Failed to create note');
      }
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!geminiPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setGenerating(true);
    try {
      const formattedPrompt = `Give me simple, clear notes with short bullet points and bold headings on this topic: ${geminiPrompt}`;
      const res = await api.post('/gemini/generate', { prompt: formattedPrompt });
      setContent(res.data.content);
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title Input */}
          <div className="form-control">
            <label className="label font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter note title"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Gemini Prompt Input */}
          <div className="form-control">
            <label className="label font-semibold">AI Assistance</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What would you like notes on?"
                className="input input-bordered flex-1"
                value={geminiPrompt}
                onChange={(e) => setGeminiPrompt(e.target.value)}
              />
              <button type="button" className="btn btn-accent" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : <><Sparkles className="size-4 mr-1" /> Generate</>}
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="form-control">
            <label className="label font-semibold">Content</label>
            <textarea
              placeholder="Write your note here..."
              className="textarea textarea-bordered h-[400px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="text-right">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Create Note'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
