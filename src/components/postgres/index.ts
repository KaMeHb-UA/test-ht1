import pgp from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
const pgInited = pgp();

export const name = 'Postgres connector';

export default async ({ loadComponent }: import('..').LoadOptions): Promise<() => pgp.IDatabase<{}, pg.IClient>> => {
    const getArgs = await loadComponent('CLI arguments parser');
    const { options: { 'db-url': dbURL } } = getArgs();
    const db = pgInited(dbURL);
    const client = await db.connect();
    await client.done();
    return () => {
        return db;
    };
}
