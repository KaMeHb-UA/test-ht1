import * as argsParser from '@/components/args';
import * as postgresConnector from '@/components/postgres';
import * as dataInterface from '@/components/data';
import * as githubComponent from '@/components/github';

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Remap<A extends any[]> = UnionToIntersection<{
    // @ts-ignore
    [P in keyof A]: A[P] extends { name: infer N, default: infer L } ? { [x in N]: L }: never;
}[number]>;

export type Components = Remap<[
    typeof argsParser,
    typeof postgresConnector,
    typeof dataInterface,
    typeof githubComponent,
]>;
