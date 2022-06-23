import type { Components } from './components';

// @ts-ignore
const loadedComponents: {
    [x in keyof Components]: ReturnType<Components[x]> | Promise<ReturnType<Components[x]>>
} = {};

type Params<F> = F extends (params: infer P) => any ? P : never;

export function registerComponent<N extends keyof Components>({ name, default: loader }: { name: N, default: Components[N] }, options: Params<Components[N]>){
    if(name in loadedComponents) throw new Error('Cannot register component ' + name + ' twice');
    let start: number;
    // @ts-ignore
    loadedComponents[name] = new Promise(r => setTimeout(r))
        // @ts-ignore
        .then(() => (start = Date.now(), loader(options)))
        .then(component => {
            console.log(`${name} loaded in ${Date.now() - start} ms`);
            // @ts-ignore
            return loadedComponents[name] = component;
        });
}

export function unregisterComponent<N extends keyof Components>(name: N){
    delete loadedComponents[name];
}

export async function loadComponent<N extends keyof Components>(name: N){
    if(name in loadedComponents) return loadedComponents[name];
    throw new Error('There is no registered component named ' + name);
}
