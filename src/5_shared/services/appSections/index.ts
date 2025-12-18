import { type AppSectionsConfig, appSectionsConfig } from './appSections.config';
import { AppSection } from './appSections.interfaces';
import { type AppPath, t } from './appSections.translate';

class AppSectionService {
    public readonly sectionsTree: AppSection<AppPath>[];
    public readonly sectionPaths: AppPath[] = [];
    constructor(
        appSectionsConfig: AppSectionsConfig,
        public readonly pathTranslator: (path: AppPath) => string,
    ) {
        this.sectionsTree = this.init(appSectionsConfig);
    }
    private readonly init = (config: AppSectionsConfig): AppSection<AppPath>[] => {
        return config.map((section): AppSection<AppPath> => {
            this.sectionPaths.push(section.path);

            const baseSection: Omit<AppSection<AppPath>, 'children'> = {
                path: section.path,
                component: section.component,
                label: this.pathTranslator(section.path),
                isDynamic: section.isDynamic,
            };

            if (section.children?.length) {
                return {
                    ...baseSection,
                    children: this.init(section.children),
                };
            }

            return baseSection;
        });
    };
}

export const appSections = new AppSectionService(appSectionsConfig, t);
export type { AppPath, AppSection, AppSectionService };
