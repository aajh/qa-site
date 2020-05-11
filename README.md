# qa-site
A question and answer site

## Usage

Install [db-migrate](https://www.npmjs.com/package/db-migrate) to run database migrations:
```
npm install -g db-migrate
```

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

In the project root run:
```
npm install
db-migrate up
npm run start:dev
```
This starts the development server on http://localhost:8080.

If needed, run `db-migrate up:test` to populate the database with test data.


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
db-migrate up -e production
npm run start
```
