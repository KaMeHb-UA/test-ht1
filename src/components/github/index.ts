import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";

const OctokitWithPagination = Octokit.plugin(paginateRest);

type LoadOptions = import('..').LoadOptions;

export const name = 'GitHub';

export default ({}: LoadOptions) => {
    const octokit = new OctokitWithPagination();
    return () => ({
        async getRepos(username: string){
            const repos = [];
            for await(const resp of octokit.paginate.iterator('GET /users/{username}/repos', { username })){
                repos.push(...resp.data.map(({ id, name, html_url, language }) => ({
                    id,
                    name,
                    url: html_url,
                    language,
                })));
            }
            return repos;
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
