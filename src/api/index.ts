import express from 'express';

import questions from './questions';

const router = express.Router();

router.use('/questions', questions);

export default router;
