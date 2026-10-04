import { apiFetch } from '@/helpers/apiHelper';

export async function getPosts(params: Record<string, any> = {}) {
  return apiFetch('/posts', { params });
}

export async function getPostById(id: string | number) {
  return apiFetch(`/posts/${id}`);
}

export async function addPost(payload: { description: string }) {
  return apiFetch('/posts', { method: 'POST', body: payload });
}

export async function updatePost(id: string | number, payload: { description: string }) {
  return apiFetch(`/posts/${id}`, { method: 'PUT', body: payload });
}

export async function changeCover(id: string | number, file: File) {
  const formData = new FormData();
  formData.append('cover', file);
  return apiFetch(`/posts/${id}/cover`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}

export async function deletePost(id: string | number) {
  return apiFetch(`/posts/${id}`, { method: 'DELETE' });
}

export async function likePost(id: string | number, like: 0 | 1 = 1) {
  return apiFetch(`/posts/${id}/likes`, {
    method: 'POST',
    body: { like },
  });
}

export async function addComment(id: string | number, payload: { comment: string }) {
  return apiFetch(`/posts/${id}/comments`, { method: 'POST', body: payload });
}

export async function deleteComment(postId: string | number, commentId: string | number) {
  return apiFetch(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
}

export async function deleteAllPosts() {
  return apiFetch('/posts', { method: 'DELETE' });
}
