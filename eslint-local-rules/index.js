import noRestrictedMobxReactionImport from './no-restricted-mobx-reaction-import.js';
import noRestrictedI18NImport from './no-restricted-i18next-import.js';
import noCssModulesInDirectories from './no-css-modules-in-directories.js';
import noHooksInDirectories from './no-hooks-in-directories.js';
import stateControllerMustExtend from './state-controller-must-extend.js';
import noNestedComponentsDirectory from './no-nested-components-directory.js';

export const localRules = {
    rules: {
        'no-restricted-mobx-reaction-import': noRestrictedMobxReactionImport,
        'no-restricted-i18next-import': noRestrictedI18NImport,
        'no-css-modules-in-directories': noCssModulesInDirectories,
        'no-hooks-in-directories': noHooksInDirectories,
        'state-controller-must-extend': stateControllerMustExtend,
        'no-nested-components-directory': noNestedComponentsDirectory,
    },
};



