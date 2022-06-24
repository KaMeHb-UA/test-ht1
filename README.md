### Prerequisites
It's not a monorepo so you need to install all the deps simply running
```sh
yarn install --frozen-lockfile
```

### Building

To build the app run
```sh
yarn build
```
Now you should see new directory named `dist`. There are files required for running the app.

### Running

To run release version of the app you should build it first.
You also may configure `DB_CONNECTION_URL` env variable to avoid specifying `--db-url=...` option each time running the app.  
Next, `cd` to `dist` directory and invoke the file `index.js`. On Mac and Linux it can be invoked directly as it is executable. On Windows you should invoke `node index.js`.  
If you have not configured `DB_CONNECTION_URL` variable, you should append option `--db-url=...` right after `index.js`.  
Also you should specify command you're about to run and its args. 
So the main CLI looks like this (all the options are optional while command and arguments — required ones):
```sh
./index.js --opt1=value --opt2=value command argument1 argument2
```

### Commands

#### `fetch`
Gets user data and repositories, saves it to DB

##### options
###### `--db-url`
Specifies DataBase url. Rewrites `DB_CONNECTION_URL` variable

##### arguments
###### `username`
Specifies the user which info should be loaded and saved

#### `list`
Gets user data and repositories, saves it to DB

##### options
###### `--db-url`
Specifies DataBase url. Rewrites `DB_CONNECTION_URL` variable
###### `--location`
Specifies user location
###### `--language`
Specifies programming language that user have used in their repos

##### arguments
> this command has no arguments
