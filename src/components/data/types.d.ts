import loadComponent from "..";

type Unpromisify<P> = P extends PromiseLike<infer T> ? T : P;

// @ts-ignore
declare async function connetorGetter() {
    return await loadComponent('Postgres connector')
}

export type DB = ReturnType<Unpromisify<ReturnType<typeof connetorGetter>>>
