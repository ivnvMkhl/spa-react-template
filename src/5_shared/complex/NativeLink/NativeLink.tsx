import { FC, ReactNode } from 'react';

type Props = {
    onClick: () => void;
    children: ReactNode;
    href?: string;
};

export const NativeLink: FC<Props> = ({ onClick, children, href = '' }) => {
    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
            {children}
        </a>
    );
};
