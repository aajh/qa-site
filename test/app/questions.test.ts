import 'expect-puppeteer';

import { resetDatabase, SERVER_URL } from '../testHelpers';

beforeEach(async () => {
    await resetDatabase();
    await page.goto(SERVER_URL);
});

it('should display questions on the front page', async () => {
    await expect(page).toMatch('favicon.ico 500 error when fetching robots.txt');
    await expect(page).toMatch('Sample the neighbour value from a list');
});

it('should show question when clicked', async () => {
    await expect(page).toClick('a', { text: 'favicon.ico 500 error when fetching robots.txt' });
    await expect(page).toMatch('I have an error 500 on my example.com/robots.txt page.');
    await expect(page).toMatch('Just do something else.');
});

it('should show the new question when it is posted', async () => {
    const question = {
        title: 'Test title',
        author: 'Test author',
        body: 'Test body'
    };

    await expect(page).toClick('a', { text: 'Ask' });
    await expect(page).toFillForm('form', question);
    await expect(page).toClick('button', { text: 'Submit Question' });

    for (const value of Object.values(question)) {
        // eslint-disable-next-line no-await-in-loop
        await expect(page).toMatch(value);
    }
});

it('should show the new answer when it is posted', async () => {
    const question = {
        author: 'Test author',
        body: 'Test body'
    };

    await expect(page).toClick('a', { text: 'favicon.ico 500 error when fetching robots.txt' });
    await expect(page).toFillForm('form', question);
    await expect(page).toClick('button', { text: 'Submit Answer' });

    await expect(page).toMatch(question.author);
    await expect(page).toMatch(question.body);
});
