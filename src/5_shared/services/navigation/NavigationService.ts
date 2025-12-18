import type { AppPath, AppSectionService } from '@shared/services/appSections';
import { createBrowserHistory, History } from 'history';
import { matchPath } from 'react-router-dom';

export class NavigationService {
    public readonly history: History;

    constructor(private readonly appSections: AppSectionService) {
        this.history = createBrowserHistory();
        this.subscribeDocumentTitle();
    }

    private readonly getAppPathByPathname = (pathName: string): AppPath | undefined => {
        return this.appSections.sectionPaths.find((path) => matchPath(pathName, { path, exact: true, strict: false }));
    };

    private readonly subscribeDocumentTitle = () => {
        const foundPath = this.getAppPathByPathname(this.history.location.pathname);
        document.title = this.getDocumentTitle(foundPath);
        this.history.listen((location) => {
            document.title = this.getDocumentTitle(this.getAppPathByPathname(location.pathname));
        });
    };

    public readonly getDocumentTitle = (appPath?: AppPath) => {
        return appPath ? this.appSections.pathTranslator(appPath) : 'SPA App';
    };
}
