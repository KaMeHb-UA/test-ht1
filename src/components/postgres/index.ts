import pgp from 'pg-promise';
const pgInited = pgp();

export const name = 'Postgres connector';

export default async ({ loadComponent, argv, defaultArgs }: import('..').LoadOptions) => {
    const parse = await loadComponent('CLI arguments parser');
    const { options: { 'db-url': dbURL } } = parse(argv, defaultArgs);
    const db = pgInited(dbURL);
    const client = await db.connect();
    await client.done();
    return () => {
        return db;
    };
}
