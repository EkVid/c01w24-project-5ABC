import Link from "next/link";
import styles from "@/styles/Navbar/unauthNavBar.module.css";

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
          <p className={styles.button}>Login</p>
        </Link>
        <Link href="/register">
          <p className={styles.button}>Register Now →</p>
        </Link>
      </div>
    </nav>
  );
};

export default NewBar;
