import Router from 'express-promise-router';

import users from './users';
import questions from './questions';

const router = Router();

router.use('/', users);
router.use('/questions', questions);

export default router;
