import Link from "next/link";
import styles from "@/styles/Navbar/unauthNavBar.module.css";

const NewBar = () => {
  return (
    <nav className={`${styles.nav} dark:d-custom-dark-grey-background dark:border-y-2 dark:border-neutral-600 transition-colors`}>
      <div className={`${styles.logo}`}>
        <Link href="/">
          <p className="dark:d-text">Logo</p>
        </Link>
      </div>
      <div className={styles.actions}>
        <Link href="/login">
          <p className={styles.button}>Login</p>
        </Link>
        <Link href="/signup">
          <p className={styles.button}>Register Now →</p>
        </Link>
      </div>
    </nav>
  );
};

export default NewBar;
