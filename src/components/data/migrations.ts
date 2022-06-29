import { getMetadata, setMetadata } from './metadata';
import sorted from './files';
import { readFile } from 'node:fs/promises';

function readFilesSection(files: [name: string, path: string][]){
    return Promise.all(files.map(async ([name, path]) => {
        const content = await readFile(path, 'utf8');
        return [name, content] as [name: string, content: string];
    }));
}

async function readFiles(files: typeof sorted){
    return Promise.all(files.map(readFilesSection));
}

type DB = import('./types').DB;

async function getVersion(db: DB, metadataTableName: string){
    try{
        return await getMetadata(db, metadataTableName, 'version');
    } catch(e){
        await db.any(`CREATE TABLE ${metadataTableName} (name varchar(256) NOT NULL PRIMARY KEY, value JSON)`);
        await setVersion(db, metadataTableName, 0);
    }
    return await getMetadata(db, metadataTableName, 'version');
}

async function setVersion(db: DB, metadataTableName: string, version: number){
    await setMetadata(db, metadataTableName, 'version', version);
}

export default async (db: DB, metadataTableName: string): Promise<void> => {
    const dbVersion = await getVersion(db, metadataTableName);
    const migrationsVersion = sorted.length;
    if(dbVersion > migrationsVersion) throw new Error('DB scheme version is higher than exist in migrations. Aborting migration');
    if(dbVersion === migrationsVersion) return;
    console.log(`Migrating DB schema from version ${dbVersion} to version ${migrationsVersion}`);
    const filesToRead = sorted.slice(dbVersion);
    const files = await readFiles(filesToRead);
    let version = dbVersion;
    for(const versionFiles of files){
        version++;
        for(const [ name, content ] of versionFiles){
            const start = Date.now();
            try{
                await db.any(content);
                console.log(`v${version}: ${name} done in ${Date.now() - start} ms`);
            } catch(e){
                console.log(`v${version}: ${name} failed in ${Date.now() - start} ms`);
                throw e;
            }
        }
        await setVersion(db, metadataTableName, version);
    }
    console.log('DB schema successfully migrated to version ' + migrationsVersion);
}
