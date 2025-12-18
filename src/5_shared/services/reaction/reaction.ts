import { appConfigService } from '@shared/services/appConfig';
import { IReactionOptions, IReactionPublic, reaction as mobXReaction, toJS } from 'mobx';

type ReactionPrivateInterface = {
    name_: string;
    observing_: { name_: string }[];
} & IReactionPublic;

const reaction = <T, FireImmediately extends boolean = false>(
    expression: (r: IReactionPublic) => T,
    effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void,
    options?: IReactionOptions<T, FireImmediately>,
) => {
    if (!appConfigService.config?.reactionLogger) {
        return mobXReaction(expression, effect, options);
    }

    const effectWidthLogger = (
        value: T,
        prevValue: FireImmediately extends true ? T | undefined : T,
        reaction: IReactionPublic,
    ) => {
        const reactionMeta = reaction as ReactionPrivateInterface;
        const reactionName = reactionMeta.name_;
        const reactionTrigger = reactionMeta.observing_[0].name_;
        const values = {
            prevValue: toJS(prevValue),
            value: toJS(value),
            name: reactionName,
        };
        console.info(
            '%c Reaction! ' + `%c ${reactionTrigger} `,
            'background: #fff; color: #000',
            'background: #fff; color: #FF0000',
            values,
        );

        effect(value, prevValue, reaction);
    };

    return mobXReaction(expression, effectWidthLogger, options);
};

export { reaction };
