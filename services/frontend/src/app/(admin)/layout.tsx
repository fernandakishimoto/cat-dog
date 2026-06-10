import AdminHeader from '@/components/AdminHeader/AdminHeader';
import AdminTabs from '@/components/AdminTabs/AdminTabs';

import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout} data-testid="admin-layout">
      <AdminHeader />
      <AdminTabs />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
