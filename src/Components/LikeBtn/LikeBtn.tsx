import styles from './likebtn.module.css'
import { useDispatch } from 'react-redux';
import { dislike } from '../../services/dislike';
import { like } from '../../services/like';
import { catchLikesClick } from '../../store/blog';
import { AppDispatch } from '../../store/store';
import { useEffect, useState } from 'react';
import { likedYet } from '../../services/likedYet';

export function LikeBtn({post_id,user_id}:{post_id:number,user_id:number}) {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleLike = async () => {
    setLoading(true);
    if (isLiked) {
      await dislike(post_id, user_id);
    } else {
      await like(post_id, user_id);
    }
    dispatch(catchLikesClick());
    setIsLiked(!isLiked);
    setLoading(false);
  };
  

  useEffect(() => {
    const fetchData = async() => {
      const res = await likedYet(post_id ,user_id)
      res.map((el:{post_id: number,user_id: number}) => {
        return el.user_id == user_id ? setIsLiked(true) : false;
      })
    }

    fetchData()

  },[post_id,user_id])


  return (
    <>
    <button onClick={toggleLike} className={isLiked ? 'liked' : ''} disabled={loading}>
      {isLiked ? '🩷' : '🤍' }
    </button>
    </>
  );
}
