import express from 'express';
import { addSchool, listSchools } from '../controllers/schoolController.js';
import { validateSchoolData, validateLocationParams } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/addSchool', validateSchoolData, addSchool);
router.get('/listSchools', validateLocationParams, listSchools);

export default router;
