export interface PostProps {
  post: {
    post_id: string;
    user_id: string;
    content: string;
    created_at: string; // Формат ISO
    username: string;
  };
}