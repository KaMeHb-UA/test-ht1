type Metadata = {
    name: string;
    value: string;
};

type WellKnown = {
    'version': number;
};

type Value<N> = N extends keyof WellKnown ? WellKnown[N] : any;

type DB = import('./types').DB;

export async function getMetadata<N extends string>(db: DB, metadataTableName: string, name: N): Promise<Value<N>> {
    const [{ value }] = await db.any<Metadata>(`SELECT value FROM ${metadataTableName} WHERE name = $1`, [ name ]);
    return JSON.parse(value);
}

export async function setMetadata<N extends string>(db: DB, metadataTableName: string, name: N, value: Value<N>): Promise<void> {
    await db.any(
        `INSERT INTO ${metadataTableName} (name, value) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET value = $2;`,
        [ name, JSON.stringify(value) ],
    );
}
