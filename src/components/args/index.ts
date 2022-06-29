export const name = 'CLI arguments parser';

type ParsedArgs = {
    options: {
        [x: string]: string;
    };
    args: string[];
}

export default ({ argv, defaultArgs }: import('..').LoadOptions): () => ParsedArgs => () => {
    const options: { [x: string]: string } = Object.assign({}, defaultArgs);
    let i = 2, arg: string;
    if(argv.length > 2) while(arg = argv[i++], arg.startsWith('--')){
        const [ name, ...rest ] = arg.slice(2).split('=');
        options[name] = rest.join('=');
        if(i === argv.length) continue;
    }
    return { options, args: argv.slice(i - 1) };
}
