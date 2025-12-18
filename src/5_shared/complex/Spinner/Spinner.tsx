import cx from 'classnames';
import { FC } from 'react';

// Используется динамическое обращение к мапе стилей
// eslint-disable-next-line postcss-modules/no-unused-class
import styles from './Spinner.module.css';

type Props = {
    size?: 'small' | 'medium' | 'large';
};

export const Spinner: FC<Props> = ({ size = 'medium' }) => {
    return <div className={cx(styles.spinner, styles[size])} />;
};
