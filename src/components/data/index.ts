import migrate from './migrations';

export const name = 'Data interface';

type UserData = {
    name: string;
    location: string;
};

type RepoData = {
    id: number;
    name: string;
    language: string;
    url: string;
}

function createDataInterface(db: import('./types').DB){
    return {
        async addUser(data: UserData){
            const keys = [
                'name',
                'location',
            ];
            await db.any(
                `INSERT INTO users (${keys.join(',')}) VALUES (${keys.map((_, i) => '$' + (i + 1)).join(',')})`,
                keys.map(name => data[name]),
            );
        },
        async addRepos(user: string, repos: RepoData[]){
            const keys = [
                '"user"',
                'id',
                'name',
                'language',
                'url',
            ];
            await db.any(
                `INSERT INTO repos (${keys.join(',')}) VALUES (${repos.map(
                    (_, i) => `'${user}',$${i * 4 + 1},$${i * 4 + 2},$${i * 4 + 3},$${i * 4 + 4}`
                ).join('),(')})`,
                repos.reduce((arr, { id, name, language, url }) => {
                    arr.push(id, name, language, url);
                    return arr;
                }, []),
            );
        },
        async getUsersByLocation(location: string){
            const users = await db.any<{ name: string }>(
                'SELECT name FROM users WHERE location = $1',
                [ location ],
            );
            return users.map(({ name }) => name);
        },
        async getUsersByLanguage(language: string){
            const users = await db.any<{ user: string }>(
                'SELECT DISTINCT "user" FROM repos WHERE language = $1',
                [ language ],
            );
            return users.map(({ user }) => user);
        },
        async getUsersByLocationAndLanguage(location: string, language: string){
            const users = await db.any<{ user: string }>(
                'SELECT DISTINCT repos."user" FROM repos LEFT JOIN users ON repos."user" = users.name WHERE repos.language = $1 AND users.location = $2',
                [ language, location ],
            );
            return users.map(({ user }) => user);
        }
    };
}

export default async ({ loadComponent }: import('..').LoadOptions) => {
    const [ getArgs, getDB ] = await Promise.all([
        loadComponent('CLI arguments parser'),
        loadComponent('Postgres connector'),
    ]);
    const { options: { 'metadata-table': metadataTableName } } = getArgs();
    if(!metadataTableName) throw new TypeError('metadata-table option should not be empty');
    const db = getDB();
    await migrate(db, metadataTableName);
    return () => createDataInterface(db);
}
