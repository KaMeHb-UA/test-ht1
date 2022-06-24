import pgp from 'pg-promise';
const pgInited = pgp();

export const name = 'Postgres connector';

export default async ({ loadComponent }: import('..').LoadOptions) => {
    const getArgs = await loadComponent('CLI arguments parser');
    const { options: { 'db-url': dbURL } } = getArgs();
    const db = pgInited(dbURL);
    const client = await db.connect();
    await client.done();
    return () => {
        return db;
    };
}
