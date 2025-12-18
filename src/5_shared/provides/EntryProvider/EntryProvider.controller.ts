import type { AppConfigService } from '@shared/services/appConfig';
import type { AuthService } from '@shared/services/auth';
import { ReactionController } from '@shared/services/reaction';

import type { EntryProviderState } from './EntryProvider.state';
import { t } from './EntryProvider.translate';

class EntryProviderController extends ReactionController {
    constructor(
        private readonly uiState: EntryProviderState,
        private readonly authService: AuthService,
        private readonly spaConfig: AppConfigService<AppConfig>,
    ) {
        super();
        this.subscribe();
    }

    private readonly authInit = async () => {
        try {
            await this.authService.init();
        } catch (error) {
            throw new Error(t('errors.authError') + (error instanceof Error ? error?.message : ''));
        }
    };

    subscribe = () => {
        this.reaction([() => this.uiState.isRendered], async () => {
            if (this.uiState.isRendered) {
                this.uiState.isLoading = true;
                try {
                    this.spaConfig.validateConfig((err) => {
                        this.uiState.error = err;
                    });
                    // Авторизация отключена
                    // eslint-disable-next-line no-constant-condition
                    if (false) {
                        await this.authInit();
                        await this.authService.getAccessToken();
                    }
                } catch (error) {
                    this.uiState.error = error instanceof Error ? error : new Error(t('errors.appLoadingError'));
                } finally {
                    this.uiState.isLoading = false;
                }
            }
        });
    };
}

export { EntryProviderController };
