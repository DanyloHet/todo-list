import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import styles from '../css-modules/Header.module.css';

function Header() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Todo List');

  // Set dynamic title based on route
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setPageTitle('Todo List');
        break;
      case '/about':
        setPageTitle('About');
        break;
      default:
        setPageTitle('Not Found');
        break;
    }
  }, [location]);

  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>{pageTitle}</h1>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
