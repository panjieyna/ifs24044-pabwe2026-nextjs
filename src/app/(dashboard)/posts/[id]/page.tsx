'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  asyncGetPostById,
  asyncDeletePost,
  asyncLikePost,
  asyncChangePost,
  asyncChangePostCover,
  asyncAddComment,
  asyncDeleteComment,
} from '@/features/posts/states/action';
import { formatDate, coverUrl, showConfirmDialog } from '@/helpers/toolsHelper';
import useInput from '@/hooks/useInput';
import { FiArrowLeft, FiHeart, FiTrash2, FiEdit2, FiImage } from 'react-icons/fi';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { post, isPost, isPostDelete } = useAppSelector((s) => s.posts);
  const profile = useAppSelector((s) => s.users.profile);
  const [comment, onCommentChange, setComment] = useInput('');
  const [editDesc, onEditDescChange, setEditDesc] = useInput('');
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (id) dispatch(asyncGetPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post?.description) setEditDesc(post.description);
  }, [post, setEditDesc]);

  const isOwner = profile && post && (profile.id === post.user_id || profile.id === post.author?.id);

  async function handleDelete() {
    const result = await showConfirmDialog('Hapus postingan?', 'Tidak dapat dibatalkan.', 'Hapus');
    if (result.isConfirmed) {
      try {
        await dispatch(asyncDeletePost(id));
        router.replace('/posts');
      } catch {
        /* handled */
      }
    }
  }

  async function handleLike() {
    try {
      await dispatch(asyncLikePost(id));
      await dispatch(asyncGetPostById(id));
    } catch {
      /* handled */
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await dispatch(asyncAddComment(id, comment));
      setComment('');
    } catch {
      /* handled */
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await dispatch(asyncChangePost(id, { description: editDesc }));
      await dispatch(asyncGetPostById(id));
      setShowEdit(false);
    } catch {
      /* handled */
    }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(asyncChangePostCover(id, file));
      await dispatch(asyncGetPostById(id));
    } catch {
      /* handled */
    }
  }

  if (isPost || !post) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="sr-only">Detail Postingan</h1>
      <Link href="/posts" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-800">
        <FiArrowLeft aria-hidden /> Kembali
      </Link>

      <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {post.cover && (
          <div className="aspect-video bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl(post.cover) || ''} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 space-y-4">
          <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
            <div>
              <span className="block text-xs text-slate-600">Penulis</span>
              {post.author?.name || post.user?.name || '-'}
            </div>
            <div>
              <span className="block text-xs text-slate-600">Dipublikasikan</span>
              {formatDate(post.created_at)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLike}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FiHeart aria-hidden /> Like ({post.likes_count ?? post.likes?.length ?? 0})
            </button>
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FiEdit2 aria-hidden /> Ubah
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <FiImage aria-hidden /> Cover
                  <input type="file" accept="image/*" className="hidden" onChange={handleCover} aria-label="Unggah cover" />
                </label>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPostDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <FiTrash2 aria-hidden /> Hapus
                </button>
              </>
            )}
          </div>
        </div>
      </article>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">Komentar</h2>
        <form onSubmit={handleComment} className="flex gap-2">
          <label htmlFor="comment-input" className="sr-only">
            Tulis komentar
          </label>
          <input
            id="comment-input"
            type="text"
            value={comment}
            onChange={onCommentChange}
            placeholder="Tulis komentar..."
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
          />
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-sky-800 text-white font-semibold">
            Kirim
          </button>
        </form>
        <ul className="divide-y divide-slate-100">
          {(post.comments || []).map((c: any) => (
            <li key={c.id} className="py-3 flex justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{c.author?.name || c.user?.name || 'User'}</p>
                <p className="text-sm text-slate-700">{c.comment || c.content}</p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => dispatch(asyncDeleteComment(id, c.id))}
                  className="text-red-700 text-sm"
                  aria-label="Hapus komentar"
                >
                  Hapus
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <form onSubmit={handleEdit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4">
            <h2 className="font-bold text-lg">Ubah Postingan</h2>
            <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-700">
              Deskripsi
            </label>
            <textarea
              id="edit-desc"
              value={editDesc}
              onChange={onEditDescChange}
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowEdit(false)} className="flex-1 py-2.5 rounded-xl border">
                Batal
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sky-800 text-white font-semibold">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
