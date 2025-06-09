import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { PlusIcon, User, ArrowLeft, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const isHome = location.pathname === "/home";
  const isCreate = location.pathname === "/create";
  const isNoteDetail = location.pathname.startsWith("/note/");

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await api.post("/users/logout");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const handleDeleteNote = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${params.id}`);
      toast.success("Note deleted");
      navigate("/home");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  return (
    <header className="bg-slate-200 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {(isCreate || isNoteDetail) && (
              <Link to="/home" className="btn btn-ghost">
                <ArrowLeft className="size-4" />
                Back to Notes
              </Link>
            )}
            {isHome && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <User className="size-5" />
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-32"
                >
                  <li>
                    <button onClick={handleLogout} className="text-red-500">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-pink-500 font-mono tracking-tight">
            Simple Notes
          </h1>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isHome && (
              <Link to="/create" className="btn btn-primary">
                <PlusIcon className="size-5" />
                <span>New Note</span>
              </Link>
            )}
            {isNoteDetail && (
              <button onClick={handleDeleteNote} className="btn btn-outline btn-error">
                <Trash2Icon className="size-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
