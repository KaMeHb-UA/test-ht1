import * as argsParser from '@/components/args';
import * as postgresConnector from '@/components/postgres';
import { loadComponent, registerComponent } from '@/services/component-registration';
import { argv, env } from 'node:process';

const {
    DB_CONNECTION_URL,
} = env;

const loadOptions = {
    argv,
    loadComponent,
    defaultArgs: {
        'db-url': DB_CONNECTION_URL,
    },
};

await Promise.all([
    argsParser,
    postgresConnector,
].map(v => registerComponent(v, loadOptions)));

export type LoadOptions = typeof loadOptions;

export default loadComponent
