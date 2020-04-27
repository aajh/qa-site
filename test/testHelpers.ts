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

export function getTestUser() {
    return {
        id: '7c73b441-3ca3-47b4-b4fb-a6c7bb91d780',
        username: 'Kevin',
        password: 'password',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjNzNiNDQxLTNjYTMtNDdiNC1iNGZiLWE2YzdiYjkxZDc4MCIsInVzZXJuYW1lIjoiS2V2aW4iLCJpYXQiOjE1ODc5Njk0MzF9.B-wxFE_vJnUTkkGaBBqiWvva-sSSMuaRR5xqqOMyhr8',
    };
}

export function getLoggedInJsonHeaders() {
    const { token } = getTestUser();
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}
