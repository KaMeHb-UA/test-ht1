import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import fromAsyncUntyped from 'array-from-async';

const fromAsync = fromAsyncUntyped as <T>(iterable: T) => Promise<Array<T extends AsyncIterable<infer R> ? R : never>>

const OctokitWithPagination = Octokit.plugin(paginateRest);

type LoadOptions = import('..').LoadOptions;

export const name = 'GitHub';

export default ({}: LoadOptions) => {
    const octokit = new OctokitWithPagination();
    return () => ({
        async getRepos(username: string){
            const res = await fromAsync(octokit.paginate.iterator('GET /users/{username}/repos', { username }));
            return res.map(v => v.data).flat().map(({ id, name, html_url, language }) => ({
                id,
                name,
                url: html_url,
                language,
            }));
        },
        async getUserData(username: string){
            for await(const resp of octokit.paginate.iterator('GET /users/{username}', { username })){
                const { location } = resp.data as any;
                return {
                    location: location as string,
                    name: username,
                }
            }
        },
    });
}
