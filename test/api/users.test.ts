import 'isomorphic-fetch';

import { resetDatabase, SERVER_URL, createUser, getTestUser } from '../testHelpers';
import * as api from '../../src/api/types';

beforeEach(async () => {
    await resetDatabase();
});

test('POST /users', async () => {
    const user = {
        username: 'Test',
        password: 'password',
    };
    const response = await fetch(`${SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    expect(response.ok).toBe(true);
    const { token }: api.Login = await response.json();
    expect(token).toBeDefined();
});

it('should fail to create user with the same username', async () => {
    const user = {
        username: 'Test',
        password: 'password',
    };
    const success1 = await createUser(user.username, user.password);
    expect(success1).toBe(true);
    const success2 = await createUser(user.username, user.password);
    expect(success2).toBe(false);
});

test('POST /login', async () => {
    const user = getTestUser();
    const response = await fetch(`${SERVER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    expect(response.ok).toBe(true);
    const { token }: api.Login = await response.json();
    expect(token).toBeDefined();
});
