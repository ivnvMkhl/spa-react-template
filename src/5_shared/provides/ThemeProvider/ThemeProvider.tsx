import './zeroStyles.css';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FC, ReactNode } from 'react';

dayjs.extend(utc);
dayjs.locale('ru');

type Props = {
    children: ReactNode;
};

const ThemeProvider: FC<Props> = ({ children }) => {
    return <>{children}</>;
};

export { ThemeProvider };
