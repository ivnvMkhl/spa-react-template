export type AppSection<Path extends string = string> = {
    path: Path;
    label: string;
    component: string;
    isDynamic?: boolean;
    children?: AppSection<Path>[];
};
