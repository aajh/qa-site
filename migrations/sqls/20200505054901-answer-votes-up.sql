BEGIN;
    CREATE DOMAIN vote AS smallint CHECK (VALUE = 1 OR VALUE = -1);

    CREATE TABLE answer_votes (
        answer_id uuid REFERENCES answers(id) ON DELETE CASCADE,
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        direction vote,
        PRIMARY KEY(answer_id, user_id)
    );
COMMIT;