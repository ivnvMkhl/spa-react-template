import { FC } from 'react';

import type { User } from '../../User.interfaces';
import styles from './UserCardView.module.css';

type Props = {
    user: User;
};

export const UserCardView: FC<Props> = ({ user }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.name}>{user.name}</h2>
                <p className={styles.username}>@{user.username}</p>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Контактная информация</h3>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Телефон:</span>
                        <span className={styles.value}>{user.phone}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Веб-сайт:</span>
                        <span className={styles.value}>{user.website}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Адрес</h3>
                    <div className={styles.infoItem}>
                        <span className={styles.value}>
                            {user.address.street}, {user.address.suite}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.value}>
                            {user.address.city}, {user.address.zipcode}
                        </span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Компания</h3>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Название:</span>
                        <span className={styles.value}>{user.company.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Слоган:</span>
                        <span className={styles.value}>{user.company.catchPhrase}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Деятельность:</span>
                        <span className={styles.value}>{user.company.bs}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
