BEGIN;
    CREATE TABLE users (
        id uuid PRIMARY KEY,
        username varchar(128) NOT NULL UNIQUE,
        password_hash varchar(60) NOT NULL
    );

    CREATE TABLE questions (
        id uuid PRIMARY KEY,
        author_id uuid REFERENCES users(id) ON DELETE CASCADE,
        title varchar(512) NOT NULL,
        body text NOT NULL,
        created timestamp NOT NULL
    );

    CREATE TABLE answers (
        id uuid PRIMARY KEY,
        question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
        author_id uuid REFERENCES users(id) ON DELETE CASCADE,
        body text NOT NULL,
        created timestamp NOT NULL
    );
COMMIT;