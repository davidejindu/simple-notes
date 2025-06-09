import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import api from "../lib/axios.js";
import toast, { LoaderIcon } from "react-hot-toast";
import Navbar from '../componenets/Navbar.jsx';
import { Trash2Icon, Sparkles } from 'lucide-react';
import { marked } from "marked";
import DOMPurify from "dompurify";

const NoteDetail = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log('Error in fetching note', error);
        toast.error("Failed to fetch the notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note has been deleted');
      navigate("/home");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/home");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleGeminiEdit = async () => {
    if (!editingPrompt.trim()) {
      toast.error("Enter how you want the note edited");
      return;
    }

    setGenerating(true);
    try {
      const prompt = `Here is a note:\n${note.content}\n\nPlease edit this based on the following instruction: ${editingPrompt}`;
      const res = await api.post('/gemini/generate', { prompt });
      setNote({ ...note, content: res.data.content });
    } catch (err) {
      toast.error("Failed to edit with Gemini");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10' />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="form-control">
            <label className="label font-semibold">Title</label>
            <input
              type="text"
              className="input input-bordered"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
          </div>

          {/* Gemini Prompt Input */}
          <div className="form-control">
            <label className="label font-semibold">AI Assistance</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="How can I edit your notes?"
                className="input input-bordered flex-1"
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleGeminiEdit}
                disabled={generating}
              >
                {generating ? "Editing..." : <><Sparkles className="size-4 mr-1" />Generate</>}
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="form-control">
            <label className="label font-semibold">Content</label>
            <textarea
              className="textarea textarea-bordered h-[400px]"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
            />
          </div>

          {/* Rendered Markdown Preview */}
          <div className="prose max-w-none bg-white p-4 rounded border border-gray-300">
            <h3 className='mb-2 font-semibold'>Preview</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(note.content)),
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button className="btn btn-error" onClick={handleDelete}>
              <Trash2Icon className="h-4 w-4 mr-1" /> Delete Note
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteDetail;
