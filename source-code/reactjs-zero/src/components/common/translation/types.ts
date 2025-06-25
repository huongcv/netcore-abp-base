export interface OrdTransProps {
    i18nKey: string;
    values?: Record<string, any>;
    components?: Record<string, JSX.Element>;
    ns?: string | string[];
}