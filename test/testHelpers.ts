import DBMigrate from 'db-migrate';

export const PORT = 3333;
export const SERVER_URL = `http://localhost:${PORT}`;

export async function runMigrations() {
    const dbmigrate = DBMigrate.getInstance(true, {
        env: 'test'
    });
    dbmigrate.silence(true);
    await dbmigrate.reset();
    await dbmigrate.up();
}

export async function resetDatabase() {
    const dbmigrate = DBMigrate.getInstance(true, {
        env: 'test'
    });
    dbmigrate.silence(true);
    await dbmigrate.reset('test');
    await dbmigrate.up('test');
}
