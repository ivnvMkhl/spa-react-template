import { FC, ReactNode } from 'react';

import { NativeLink } from '../NativeLink';
import styles from './LinksList.module.css';

type Props = {
    links: {
        key: React.Key;
        onClick: () => void;
        label: ReactNode;
    }[];
    compact?: boolean;
};

export const LinkList: FC<Props> = ({ links, compact = false }) => {
    return (
        <ul className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
            {links.map(({ key, onClick, label }) => {
                return (
                    <li key={key} className={styles.item}>
                        <NativeLink onClick={onClick}>{label}</NativeLink>
                    </li>
                );
            })}
        </ul>
    );
};
