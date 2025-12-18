import i18n from 'i18next';

const localeGroups = { pages: {}, features: {}, entities: {}, shared: {} };

const DEVELOP_LOCALE = 'ru';

i18n.init({
    resources: {
        [DEVELOP_LOCALE]: localeGroups,
    },
    lng: DEVELOP_LOCALE,
    interpolation: { escapeValue: false },
});

type DeepKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${DeepKeyOf<T[K]>}` : K) : never;
      }[keyof T]
    : never;

const createTranslator = <T extends Record<string, unknown>>(
    group: keyof typeof localeGroups,
    componentName: string,
    translations: T,
) => {
    const currentResources = i18n.getResourceBundle(DEVELOP_LOCALE, group) || {};
    if (componentName in currentResources) {
        throw new Error(
            `Найдены два компонента с одинаковым названием в группе  ${group}.
             Пожалуйста используйте разные названия для компонентов в одной группе.`,
        );
    }
    const newResources = {
        ...currentResources,
        [componentName]: translations,
    };
    i18n.addResourceBundle(DEVELOP_LOCALE, group, newResources, true, true);

    return <K extends DeepKeyOf<T>>(token: K, params?: Record<string, unknown>) => {
        const path = `${group}:${componentName}:${String(token)}`;
        return i18n.t(path, params);
    };
};

const getLocalesMap = () => {
    return structuredClone(localeGroups);
};

export { createTranslator, getLocalesMap };
