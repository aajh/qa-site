BEGIN;
    CREATE TABLE questions (
        id uuid PRIMARY KEY,
        author varchar(128) NOT NULL,
        title varchar(512) NOT NULL,
        body text NOT NULL,
        created timestamp NOT NULL
    );

    CREATE TABLE answers (
        id uuid PRIMARY KEY,
        questionId uuid REFERENCES questions(id) ON DELETE CASCADE,
        author varchar(128) NOT NULL,
        body text NOT NULL,
        created timestamp NOT NULL
    );
COMMIT;