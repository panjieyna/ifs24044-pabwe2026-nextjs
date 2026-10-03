'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { asyncGetPosts, asyncAddPost } from '@/features/posts/states/action';
import { formatDate, coverUrl } from '@/helpers/toolsHelper';
import useInput from '@/hooks/useInput';
import { FiPlus, FiSearch, FiHeart, FiMessageCircle, FiImage } from 'react-icons/fi';

export default function PostsHomePage() {
  const dispatch = useAppDispatch();
  const { posts, isPostAdd } = useAppSelector((s) => s.posts);
  const [isMe, setIsMe] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [description, onDescChange, setDescription] = useInput('');

  useEffect(() => {
    const params: Record<string, any> = {};
    if (isMe) params.is_me = 1;
    dispatch(asyncGetPosts(params));
  }, [dispatch, isMe]);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p: any) =>
        p.description?.toLowerCase().includes(q) ||
        p.author?.name?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      await dispatch(asyncAddPost({ description }));
      setDescription('');
      setShowAdd(false);
      dispatch(asyncGetPosts(isMe ? { is_me: 1 } : {}));
    } catch {
      /* handled */
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Postingan</h1>
          <p className="text-slate-600 text-sm">Linimasa & postingan komunitas</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-sky-800 hover:bg-sky-900 text-white font-semibold px-4 py-2.5 rounded-xl"
        >
          <FiPlus aria-hidden /> Tambah Postingan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari deskripsi atau penulis..."
              aria-label="Cari postingan"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isMe}
              onChange={(e) => setIsMe(e.target.checked)}
              className="rounded border-slate-300 text-sky-800 focus:ring-sky-500"
            />
            Postingan Saya
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">Belum ada postingan</div>
        ) : (
          filtered.map((post: any) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {post.cover && (
                <div className="aspect-video bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl(post.cover) || ''}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <p className="font-medium text-slate-800 line-clamp-3">{post.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{post.author?.name || post.user?.name || '-'}</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <FiHeart aria-hidden /> {post.likes_count ?? post.likes?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiMessageCircle aria-hidden />{' '}
                    {post.comments_count ?? post.comments?.length ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4">
            <h2 className="font-bold text-lg text-slate-800">Tambah Postingan</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="post-desc" className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  id="post-desc"
                  value={description}
                  onChange={onDescChange}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none resize-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPostAdd}
                  className="flex-1 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 disabled:bg-sky-600 text-white font-semibold"
                >
                  {isPostAdd ? 'Menyimpan...' : 'Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
