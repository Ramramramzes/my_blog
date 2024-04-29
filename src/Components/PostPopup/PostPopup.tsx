import styles from './postpopup.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useRef } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { changeAddPost, changeAddPostText } from '../../store/blog';
import { postNewPost } from '../../services/postNewPost';

export const PostPopup = () => {
  const BlogState = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const newHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    newHeight();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    newHeight();
    dispatch(changeAddPostText(event.target.value));
  }

  function sendData() {
    postNewPost(BlogState.addPostText,BlogState.mainUserId)
    dispatch(changeAddPost())
    dispatch(changeAddPostText(''));
    newHeight();
  }

  return (
      <>
        <div className={styles.openButtonBlock}>
          {!BlogState.addPostState && BlogState.mainLogin && (
            <button className={styles.buttonAdd} onClick={() => dispatch(changeAddPost())}>Добавить запись</button>
          )}
        </div>
        {BlogState.addPostState && (
          <div className={styles.textareaBlock}>
            <textarea
              className={styles.textarea}
              ref={textareaRef}
              onChange={handleChange}
              style={{ overflow: 'hidden' }}
              placeholder="Введите текст"
              value={BlogState.addPostText}
            />
            <div className={styles.buttonBlock}>
              <button onClick={sendData}>Опубликовать</button>
              <button onClick={() => dispatch(changeAddPost())}>Отмена</button>
            </div>
          </div>
        )}
      </>
  );
}
