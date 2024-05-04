import { getLikes } from '../../services/getLikes';

export function Likes({post_id}:{post_id:number}) {
  const likes = getLikes(post_id)
  return (
    <p>{likes.length} лайков</p>
  );
}
