import express from 'express';

import users from './users';
import questions from './questions';

const router = express.Router();

router.use('/', users);
router.use('/questions', questions);

export default router;
