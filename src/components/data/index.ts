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

type DataInterface = {
    addUser(data: UserData): Promise<void>;
    addRepos(user: string, repos: RepoData[]): Promise<void>;
    getUsers(): Promise<string[]>;
    getUsersByLocation(location: string): Promise<string[]>;
    getUsersByLanguage(language: string): Promise<string[]>;
    getUsersByLocationAndLanguage(location: string, language: string): Promise<string[]>;
}

function createDataInterface(db: import('./types').DB): DataInterface {
    return {
        async addUser(data: UserData): Promise<void> {
            const keys = [
                'name',
                'location',
            ];
            await db.any(
                `INSERT INTO users (${keys.join(',')}) VALUES (${keys.map((_, i) => '$' + (i + 1)).join(',')})`,
                keys.map(name => data[name]),
            );
        },
        async addRepos(user: string, repos: RepoData[]): Promise<void> {
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
        async getUsers(): Promise<string[]> {
            const users = await db.any<{ name: string }>('SELECT name FROM users');
            return users.map(({ name }) => name);
        },
        async getUsersByLocation(location: string): Promise<string[]> {
            const users = await db.any<{ name: string }>(
                'SELECT name FROM users WHERE location = $1',
                [ location ],
            );
            return users.map(({ name }) => name);
        },
        async getUsersByLanguage(language: string): Promise<string[]> {
            const users = await db.any<{ user: string }>(
                'SELECT DISTINCT "user" FROM repos WHERE language = $1',
                [ language ],
            );
            return users.map(({ user }) => user);
        },
        async getUsersByLocationAndLanguage(location: string, language: string): Promise<string[]> {
            const users = await db.any<{ user: string }>(
                'SELECT DISTINCT repos."user" FROM repos LEFT JOIN users ON repos."user" = users.name WHERE repos.language = $1 AND users.location = $2',
                [ language, location ],
            );
            return users.map(({ user }) => user);
        }
    };
}

export default async ({ loadComponent }: import('..').LoadOptions): Promise<() => DataInterface> => {
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
