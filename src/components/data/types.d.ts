import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';

type Unpromisify<P> = P extends PromiseLike<infer T> ? T : P;

declare function connetorGetter(): Promise<() => pgPromise.IDatabase<{}, pg.IClient>>

export type DB = ReturnType<Unpromisify<ReturnType<typeof connetorGetter>>>
