BEGIN;
    INSERT INTO users (id, username, passwordHash) VALUES
    ('7c73b441-3ca3-47b4-b4fb-a6c7bb91d780', 'Kevin', '$2b$10$E3gJCnqZkWGOH0xrkkSrxOmEzhQVUU0sIqFZhSJChCuWBftA8Ipm2'),
    ('46669625-b447-46ce-afc7-c762a9923e0a', 'Mike', '$2b$10$E3gJCnqZkWGOH0xrkkSrxOmEzhQVUU0sIqFZhSJChCuWBftA8Ipm2'),
    ('e27fa8bf-3e9d-4eb7-bb25-2443a3ab554d', 'donto', '$2b$10$E3gJCnqZkWGOH0xrkkSrxOmEzhQVUU0sIqFZhSJChCuWBftA8Ipm2'),
    ('158deb7d-bebb-47c3-80d2-eded1bcc0d61', 'John', '$2b$10$E3gJCnqZkWGOH0xrkkSrxOmEzhQVUU0sIqFZhSJChCuWBftA8Ipm2');

    INSERT INTO questions (id, authorId, title, body, created) VALUES
    ('9eae28b9-a77b-4f39-901d-140e2d4a710c', '7c73b441-3ca3-47b4-b4fb-a6c7bb91d780', 'favicon.ico 500 error when fetching robots.txt', E'I have an error 500 on my example.com/robots.txt page.\n\nCould this cause any SEO / crawling issues? It''s just the favicon , but you never know.', '2020-04-21T16:00:00Z'),
    ('13ebf57d-4d1d-49db-aa38-301767778c81', '46669625-b447-46ce-afc7-c762a9923e0a', 'Vue recognize text pattern and replace by href to correct resource', E'I''m working on a project where I keep a log of key actions by users. For example a log entry is made when a user logs in to the application. I use a Laravel API as backend that takes care of the logging the event in the database and takes care of retrieving log entries to be displayed in the application. An example of a log entry returned for display is the following:\n\n{{user|123|\"John Doe\"}} logged in at 2020-01-03 11:00:05\n\nNow, I''d like Vue to automatically recognize that this should be replaced by the following:\n\n<router-link to=\"/user/123\">John Doe</router-link> logged in at 2020-01-03 11:00:05\n\nSo it automatically becomes a clickable link that navigates to the user profile in this case.\n\nDoes Vue offer any such functionality? Any ideas on how to approach this?\n\nThanks!', '2020-04-05T21:16:00Z'),
    ('96a2bec4-0c46-4d86-bce7-72dfee38e3b1', 'e27fa8bf-3e9d-4eb7-bb25-2443a3ab554d', 'Sample the neighbour value from a list', E'Let say, I have a list:\n\n\\[Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec\\]\n\nand I randomly choose the index (let say idx=4, thus \"May\"), I want my function to return\n\n\\[Mar,Apr,May,Jun,Jul\\]\n\nIf the index is 0 (Jan) or 1 (Feb) then I want my function to return \\[Jan,Feb,Mar,Apr,May\\]. The length of returned list is always 5.\n\nHow to create such function in Python3?\n\nSimple question but why my head starts to explode?\n\nThanks.', '2020-04-22T10:30:00Z');

    INSERT INTO answers (id, questionId, authorId, body, created) VALUES
    ('1dc42217-5ef3-40bc-ad66-fd45377359bb', '9eae28b9-a77b-4f39-901d-140e2d4a710c', '46669625-b447-46ce-afc7-c762a9923e0a', 'Just do something else.', '2020-04-21T18:01:00Z'),
    ('df39ad99-64e1-4f9f-8d61-c3b95802dbf8', '9eae28b9-a77b-4f39-901d-140e2d4a710c', '158deb7d-bebb-47c3-80d2-eded1bcc0d61', 'Do this instead.', '2020-04-22T10:16:00Z'),
    ('9c733630-35c6-40d3-8355-0ac42e3d009a', '13ebf57d-4d1d-49db-aa38-301767778c81', '158deb7d-bebb-47c3-80d2-eded1bcc0d61', 'You can''t do it, kid.', '2020-04-22T10:20:00Z');

    INSERT INTO answer_votes(answer_id, user_id, direction) VALUES
    ('df39ad99-64e1-4f9f-8d61-c3b95802dbf8', '7c73b441-3ca3-47b4-b4fb-a6c7bb91d780', 1),
    ('df39ad99-64e1-4f9f-8d61-c3b95802dbf8', '46669625-b447-46ce-afc7-c762a9923e0a', 1),
    ('df39ad99-64e1-4f9f-8d61-c3b95802dbf8', 'e27fa8bf-3e9d-4eb7-bb25-2443a3ab554d', -1);
COMMIT;