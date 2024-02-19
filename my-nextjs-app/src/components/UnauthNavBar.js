
import Link from 'next/link';
import styles from './newbar.module.css';

const NewBar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <p>Logo</p>
        </Link>
      </div>
      <div className={styles.actions}>
        <Link href="/login">
          <p>Login</p>
        </Link>
        <Link href="/register">
          <p className={styles.registerButton}>Register</p>
        </Link>
      </div>
    </nav>
  );
};

export default NewBar;
