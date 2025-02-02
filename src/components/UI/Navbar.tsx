import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';

function samePageLinkNavigation(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

const links = [
  { label: 'Новости', href: '/general' },
  { label: 'Моя лента', href: '/profile' },
];

interface LinkTabProps extends TabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.href === window.location.pathname ? 'page' : undefined} // Устанавливаем активный таб
      {...props}
    />
  );
}

export const NavTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = links.findIndex(link => link.href === location.pathname);
  const [value, setValue] = React.useState(currentIndex !== -1 ? currentIndex : 0);

  React.useEffect(() => {
    const newIndex = links.findIndex(link => link.href === location.pathname);
    if (newIndex !== -1) {
      setValue(newIndex);
    }
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (
      event.type !== 'click' ||
      (event.type === 'click' &&
        samePageLinkNavigation(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>))
    ) {
      navigate(links[newValue].href);
      setValue(newValue);
    }
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs" role="navigation">
        {links.map((link, index) => (
          <LinkTab key={index} label={link.label} href={link.href} />
        ))}
      </Tabs>
    </Box>
  );
};