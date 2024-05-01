import { useEffect, useState } from 'react';
import { getLikes } from '../../services/getLikes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function Likes({post_id,user_id}:{post_id:number,user_id:number}) {
  const BlogState = useSelector((state: RootState) => state.blog);
  const [num,setNum] = useState(0)

  useEffect(() => {
    const fetchData = async() => {
      const res = await getLikes(post_id,user_id)
      setNum(res ? res.length : 0)
    }

    fetchData()
  },[num,BlogState.likeHandler])
  return (
    <>
      {num}
    </>
  );
}
