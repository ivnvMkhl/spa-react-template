import cx from 'classnames';
import { FC, ReactNode } from 'react';

// Используется динамическое обращение к мапе стилей
// eslint-disable-next-line postcss-modules/no-unused-class
import styles from './Alert.module.css';

type Props = {
    children: ReactNode;
    variant?: 'error' | 'warning' | 'info' | 'success';
};

export const Alert: FC<Props> = ({ children, variant = 'error' }) => {
    return <div className={cx(styles.alert, styles[variant])}>{children}</div>;
};
