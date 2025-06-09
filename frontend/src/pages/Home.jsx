import React from 'react';
import Navbar from '../componenets/Navbar';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import NoteCard from '../componenets/NoteCard';
import api from '../lib/axios.js';
import NotesNotFound from '../componenets/NotesNotFound.jsx'

const Home = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/notes");
                
                setNotes(res.data);
                console.log('Fetched notes:', res.data);
                setIsRateLimited(false);
            } catch (error) {
                console.log("Error fetching notes");
                if(error.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    toast.error('Failed to load notes', { id: 'load-error' });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [])

    //makes it so the notification appears once when the rate has reached its limit
    useEffect(() => {
        if (isRateLimited) {
          toast.error('Rate Limit Reached', { id: 'rate-limit' });
        }
      }, [isRateLimited]);
      
      return (
        <>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            {notes.length === 0 && !isRateLimited && <NotesNotFound/>}
      
            {/* Notes section — positioned toward the top right */}
            <div className="max-w-7xl mx-auto p-4 mt-8 w-full">


              {notes.length > 0 && !isRateLimited && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => (
                    <NoteCard key={note._id} note={note} setNotes={setNotes}/>
                  ))}
                </div>
              )}
            </div>
      
            {/* Loading spinner centered vertically */}
            <div className="flex-1 flex items-center justify-center">
              {loading && (
                <div className="flex flex-wrap gap-4 justify-center">
                  <span className="loading loading-spinner text-primary"></span>
                  <span className="loading loading-spinner text-secondary"></span>
                  <span className="loading loading-spinner text-accent"></span>
                  <span className="loading loading-spinner text-neutral"></span>
                  <span className="loading loading-spinner text-info"></span>
                  <span className="loading loading-spinner text-success"></span>
                  <span className="loading loading-spinner text-warning"></span>
                  <span className="loading loading-spinner text-error"></span>
                </div>
              )}
            </div>
          </div>
        </>
      );
      
    }
      

export default Home