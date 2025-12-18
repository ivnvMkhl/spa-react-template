import { FC, ReactNode } from 'react';

import styles from './PageLayout.module.css';

type Props = {
    title?: ReactNode;
    children?: ReactNode;
    headerRight?: ReactNode;
};

export const PageLayout: FC<Props> = ({ title, children, headerRight }) => {
    return (
        <main className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
            </div>
            <section className={styles.pageBody}>{children}</section>
        </main>
    );
};
