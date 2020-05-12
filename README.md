# qa-site
A question and answer site build with React, Redux and Typescript with Node.js express backend. The site is deployed at https://enigmatic-waters-82684.herokuapp.com.

Features:
- Question asking and answering with voting for the answers
- User login and registration
- Server side rendering
- Integration testing with Cypress

## Usage

Create a `.env` file with variables:
```
NODE_ENV=development
DATABASE_URL=<Postgres production database url>
DEV_DATABASE_URL=<Postgres development database url>
TEST_DATABASE_URL=<Postgres test database url>
COOKIE_SESSION_SECRET=very_secret
```
To run the development server, only `DEV_DATABASE_URL` is required from the database URLs.
`DATABASE_URL` is used as the production database and to run migrations for it and `TEST_DATABASE_URL` is used by the test server.
The format for the URL is `postgres://<username>:<password>@<host>:<port>/<database>`, for example, `postgres://postgres:postgres@localhost:5432/qa_site_dev`.

To start the development server on http://localhost:8080, run:
```
npm install
npx db-migrate up
npm run start:dev
```

If needed, run `npx db-migrate up:test` to populate the database with test data.


## Running tests
Make sure that `TEST_DATABASE_URL` is set in the `.env` file. Tests can then be run with `npm run ci`.
Alternatively, a test server can be started with `npm run start:test` and the test runner started with `npm run cy:open`.

`npm run lint` runs eslint.


## Deployment
Make sure that `DATABASE_URL` and `COOKIE_SESSION_SECRET` are set in the `.env` file and `NODE_ENV` is `production`.

To start the production server, run:
```
npm install
npm run build
npx db-migrate up -e production
npm run start
```
