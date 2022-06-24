import loadComponent from '@/components';

const [
    createDataInterface,
    createGitHubInterface,
    createArgsParser,
] = await Promise.all([
    loadComponent('Data interface'),
    loadComponent('GitHub'),
    loadComponent('CLI arguments parser'),
]);

type DataInterface = ReturnType<typeof createDataInterface>;
type GitHub = ReturnType<typeof createGitHubInterface>;
type ArgsParsed = ReturnType<typeof createArgsParser>;

async function run(
    { addUser, addRepos, getUsers, getUsersByLocation, getUsersByLanguage, getUsersByLocationAndLanguage }: DataInterface,
    { getRepos, getUserData }: GitHub,
    { args, options }: ArgsParsed,
){
    const cmd = args.shift();
    switch(cmd){
        case 'fetch':
            const [ user ] = args;
            const dbUsers = await getUsers();
            if(dbUsers.includes(user)) throw new TypeError('User ' + user + ' is already in database');
            await Promise.all([
                getUserData(user).then(userData => addUser(userData)),
                getRepos(user).then(repos => addRepos(user, repos)),
            ]);
            console.log(user + '\'s data successfully written to the DB');
            return;
        case 'list':
            let users: string[], errorSpecifier = '';
            if(options.location){
                if(options.language){
                    users = await getUsersByLocationAndLanguage(options.location, options.language);
                    errorSpecifier = ' matching specified location and language';
                } else {
                    users = await getUsersByLocation(options.location);
                    errorSpecifier = ' matching specified location';
                }
            } else if(options.language){
                users = await getUsersByLanguage(options.language);
                errorSpecifier = ' matching specified language';
            } else {
                users = await getUsers();
            }
            if(!users.length) return console.error(`There is no users in DB${errorSpecifier}. Please use command "fetch <user>" to add user to the DB`);
            return console.log('Users in DB: ' + users.join(', '));
        default:
            throw new Error('Unknown command ' + JSON.stringify(cmd));
    }
}

await run(
    createDataInterface(),
    createGitHubInterface(),
    createArgsParser(),
);
