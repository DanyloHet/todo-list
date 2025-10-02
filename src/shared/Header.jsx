import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import styles from '../css-modules/Header.module.css';

function Header({title}) {

  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>{title}</h1>
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
