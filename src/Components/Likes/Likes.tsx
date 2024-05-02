import { useEffect, useState } from 'react';
import { getLikes } from '../../services/getLikes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getAllLikes } from '../../services/getAllLikes';

export function Likes({post_id}:{post_id:number}) {
  const BlogState = useSelector((state: RootState) => state.blog);
  const [num,setNum] = useState(0)
  const [likeHandler,setLikeHandler] = useState([])

  useEffect(() => {
    const fetchData = async() => {
      const res = await getLikes(post_id)
      setLikeHandler(res)
      setNum(res ? res.length : 0)
    }

    fetchData()
  },[BlogState.likeHandler,likeHandler])
  return (
    <>
      <p>{num} лайков</p>
    </>
  );
}
