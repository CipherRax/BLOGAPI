// app/blog-posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// ----------------------
// Type Definitions (matching your API)
// ----------------------
interface Post {
  _id: number;
  title: string;
  body: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// ----------------------
// API Client (modify baseURL to match your actual endpoint)
// ----------------------
const api = axios.create({
  baseURL: 'http://localhost:3003/',
  headers: { 'Content-Type': 'application/json' },
});

// ----------------------
// Main Blog Dashboard Component
// ----------------------
export default function BlogDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [singlePostId, setSinglePostId] = useState('');
  const [singlePostResult, setSinglePostResult] = useState<Post | null>(null);

  // Fetch all posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // ----------------------
  // API Handlers
  // ----------------------
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<Post[]>('/all-posts');
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<Post>('/create-post', { title, body });
      setPosts((prev) => [res.data, ...prev]);
      setTitle('');
      setBody('');
      setError('');
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !title.trim() || !body.trim()) return;
    setLoading(true);
    try {
      const res = await api.put<Post>(`/update-post/${editingId}`, { title, body });
      setPosts((prev) =>
          prev.map((post) => (post._id === editingId ? res.data : post))
      );
      setTitle('');
      setBody('');
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setLoading(true);
    try {
      await api.delete(`/delete/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      if (selectedPost?._id === id) setSelectedPost(null);
      if (singlePostResult?._id === id) setSinglePostResult(null);
      setError('');
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await api.get<Post>(`/find-post/${id}`);
      setSinglePostResult(res.data);
      setError('');
    } catch (err) {
      setError('Post not found');
      setSinglePostResult(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (post: Post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setBody(post.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
  };

  // ----------------------
  // Modern Futuristic UI
  // ----------------------
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header with glassmorphism */}
          <div className="text-center backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 animate-pulse">
              ⚡ BLOG FORGE ⚡
            </h1>
            <p className="mt-2 text-gray-300 text-lg">futuristic • modern • classic</p>
          </div>

          {/* Error Toast */}
          {error && (
              <div className="backdrop-blur-lg bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl text-center">
                ⚠️ {error}
              </div>
          )}

          {/* Create / Update Post Card */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl transition-all hover:border-cyan-400/50">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">{editingId ? '✏️ UPDATE' : '🆕 CREATE'}</span> POST
            </h2>
            <form onSubmit={editingId ? updatePost : createPost} className="space-y-4">
              <input
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={loading}
              />
              <textarea
                  placeholder="Write your post body..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition-all resize-none"
                  disabled={loading}
              />
              <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="relative group flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? '🔄 PROCESSING...' : editingId ? '✏️ UPDATE POST' : '🚀 CREATE POST'}
                </span>
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold transition-all"
                    >
                      ✕ CANCEL
                    </button>
                )}
              </div>
            </form>
          </div>

          {/* Two Column Layout: All Posts + Get By ID */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* All Posts - takes 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <span className="text-fuchsia-400">📚</span> ALL POSTS
                  </h2>
                  <button
                      onClick={fetchPosts}
                      disabled={loading}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                  >
                    🔄 REFRESH
                  </button>
                </div>

                {loading && posts.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <div key={posts.length} className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 backdrop-blur-sm bg-white/5 rounded-2xl border border-dashed border-white/20">
                      🌌 No posts yet. Create your first post above.
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {posts.map((post) => (
                          <div
                              key={post._id}
                              className={`group relative backdrop-blur-md bg-black/40 rounded-2xl border ${
                                  selectedPost?._id === post._id
                                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/20'
                                      : 'border-white/10 hover:border-white/30'
                              } p-5 transition-all`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="mt-2 text-gray-300 line-clamp-2">{post.body}</p>
                                <div className="mt-3 text-xs text-gray-400">🆔 {post._id}</div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => startEditing(post)}
                                    className="p-3 bg-blue-500/20 hover:bg-blue-500/40 rounded-xl text-blue-300 transition-all"
                                    title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                    onClick={() => deletePost(post._id)}
                                    className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-300 transition-all"
                                    title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* Get One By ID - takes 1/3 width */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">🔍</span> GET BY ID
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter post ID"
                        value={singlePostId}
                        onChange={(e) => setSinglePostId(e.target.value)}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                        onClick={() => fetchPostById(singlePostId)}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-bold hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50"
                    >
                      GET
                    </button>
                  </div>

                  {singlePostResult && (
                      <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-amber-500/50">
                        <h3 className="text-lg font-bold text-amber-300">{singlePostResult.title}</h3>
                        <p className="mt-2 text-gray-300 text-sm">{singlePostResult.body}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-400">ID: {singlePostResult._id}</span>
                          <button
                              onClick={() => deletePost(singlePostResult._id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </div>

              {/* Classic Stats Card */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-purple-900/20 rounded-3xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">📊</span> STATS
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Posts:</span>
                    <span className="text-white font-bold">{posts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="text-white">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full mt-2">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full"
                        style={{ width: `${Math.min(100, posts.length * 10)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22d3ee, #a78bfa);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
        }
      `}</style>
      </div>
  );
}