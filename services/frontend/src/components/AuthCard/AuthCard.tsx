import styles from './AuthCard.module.css';

type AuthCardPropsType = {
  children: React.ReactNode;
};

export default function AuthCard({ children }: AuthCardPropsType) {
  return (
    <div className={styles.background} data-testid="auth-card">
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/catdog-logo.png"
            alt="CatDog"
            className={styles.logo}
            data-testid="auth-card-logo"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
