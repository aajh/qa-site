BEGIN;
    CREATE TABLE users (
        id uuid PRIMARY KEY,
        username varchar(128) NOT NULL UNIQUE,
        passwordHash varchar(60) NOT NULL
    );

    CREATE TABLE questions (
        id uuid PRIMARY KEY,
        authorId uuid REFERENCES users(id) ON DELETE CASCADE,
        title varchar(512) NOT NULL,
        body text NOT NULL,
        created timestamp NOT NULL
    );

    CREATE TABLE answers (
        id uuid PRIMARY KEY,
        questionId uuid REFERENCES questions(id) ON DELETE CASCADE,
        authorId uuid REFERENCES users(id) ON DELETE CASCADE,
        body text NOT NULL,
        created timestamp NOT NULL
    );
COMMIT;