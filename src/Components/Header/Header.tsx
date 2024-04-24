import styles from './header.module.css'
import { useNavigate } from 'react-router-dom';


const buttons: {name:string,link: string}[] = [
  {name: 'Мой блог', link: '/blog'},
  {name: 'Новости', link: '/blog'},
  {name: 'Друзья', link: '/blog'},
]

export function Header() {
  const navigate = useNavigate()
  const clickHandler = (link: string) => {
    navigate(link)
  }
  return (
    <ul className={styles.header}>
      {buttons.map((el,index) => {
        return (
          <li key={index}>
            <button onClick={() => clickHandler(`${el.link}`)}>{el.name}</button>
          </li>
        )
      })}
    </ul>
  );
}
