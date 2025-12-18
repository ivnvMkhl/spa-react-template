import { ReactNode } from 'react';

import styles from './Table.module.css';

export type TableColumn<T = Record<string, unknown>> = {
    key: string;
    header: ReactNode;
    accessor?: keyof T | ((row: T) => ReactNode);
    render?: (value: unknown, row: T) => ReactNode;
};

type Props<T = Record<string, unknown>> = {
    columns: TableColumn<T>[];
    data: T[];
};

export const Table = <T extends Record<string, unknown> = Record<string, unknown>>({ columns, data }: Props<T>) => {
    const getCellValue = (column: TableColumn<T>, row: T): ReactNode => {
        if (column.render) {
            const value =
                typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : column.accessor
                      ? row[column.accessor]
                      : undefined;
            return column.render(value, row);
        }

        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }

        if (column.accessor) {
            const value = row[column.accessor];
            return value != null ? String(value) : null;
        }

        return null;
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} className={styles.headerCell}>
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className={styles.emptyCell}>
                            Нет данных
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles.row}>
                            {columns.map((column) => (
                                <td key={column.key} className={styles.cell}>
                                    {getCellValue(column, row)}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};
