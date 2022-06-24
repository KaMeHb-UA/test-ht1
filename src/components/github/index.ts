import { Octokit } from "@octokit/rest";

type LoadOptions = import('..').LoadOptions;

export const name = 'GitHub';

export default ({}: LoadOptions) => {
    const octokit = new Octokit();
    return () => ({
        async getRepos(username: string){
            const repos = await octokit.repos.listForUser({ username });
            return repos.data.map(({ id, name, html_url, language }) => ({
                id,
                name,
                url: html_url,
                language,
            }));
        },
        async getUserData(username: string){
            const { data: { location } } = await octokit.users.getByUsername({ username });
            return {
                location,
                name: username,
            };
        },
    });
}
