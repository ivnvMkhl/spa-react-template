import { useState } from 'react';

export const LocalStorageKeys = {
    THEME: 'app.theme',
} as const;

export type LocalStorageKey = (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys];

class LocalStorageService {
    static setItem<T>(key: LocalStorageKey, value: T) {
        const storageValue = JSON.stringify(value);
        localStorage.setItem(key, storageValue);
    }

    static getItem<T>(key: LocalStorageKey): T | undefined {
        const storageValue = localStorage.getItem(key);
        if (storageValue) {
            return JSON.parse(storageValue);
        }
    }

    static removeItem(key: LocalStorageKey) {
        localStorage.removeItem(key);
    }

    static readonly useLocalStorageState = <T = undefined>(
        key: LocalStorageKey,
        initialValue: T,
    ): [T, React.Dispatch<React.SetStateAction<T>>] => {
        const [value, setValue] = useState<T>(LocalStorageService.getItem<T>(key) ?? initialValue);

        const setValueWithStorage = (setStateAction: React.SetStateAction<T>) => {
            const newValue =
                typeof setStateAction === 'function' ? (setStateAction as (values: T) => T)(value) : setStateAction;

            setValue(newValue);
            this.setItem(key, newValue);
        };

        return [value, setValueWithStorage];
    };
}

export { LocalStorageService };
