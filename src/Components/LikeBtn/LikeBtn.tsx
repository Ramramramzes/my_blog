import styles from './likebtn.module.css'
import { useDispatch } from 'react-redux';
import { dislike } from '../../services/dislike';
import { like } from '../../services/like';
import { catchLikesClick } from '../../store/blog';
import { AppDispatch } from '../../store/store';
import { useEffect, useState } from 'react';
import { likedYet } from '../../services/likedYet';

export function LikeBtn({post_id,user_id}:{post_id:number,user_id:number}) {
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleLike = async () => {
    if (isLiked) {
      await like(post_id, user_id);
    } else {
      await dislike(post_id, user_id);
    }
    dispatch(catchLikesClick());
    setIsLiked(!isLiked);
  };
  

  useEffect(() => {
    const fetchData = async() => {
      const res = await likedYet(post_id,user_id)
      setIsLiked(res.length != 0 ? false : true)
    }

    fetchData()
  },[likedYet])


  return (
    <>
    <button onClick={toggleLike} className={isLiked ? 'liked' : ''}>
      {isLiked ? '🤍' : '🩷'}
    </button>
    </>
  );
}
