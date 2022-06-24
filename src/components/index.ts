import * as argsParser from '@/components/args';
import * as postgresConnector from '@/components/postgres';
import * as dataInterface from '@/components/data';
import * as githubComponent from '@/components/github';
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
        'metadata-table': '__metadata',
    },
};

await Promise.all([
    argsParser,
    postgresConnector,
    dataInterface,
    githubComponent,
].map(v => registerComponent(v, loadOptions)));

export type LoadOptions = typeof loadOptions;

export default loadComponent
