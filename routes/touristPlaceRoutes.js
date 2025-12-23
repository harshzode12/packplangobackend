import express from 'express';
import { getTouristPlaces, getTouristPlaceById, createTouristPlace, updateTouristPlace, deleteTouristPlace } from '../controllers/touristPlaceController.js';

const router = express.Router();

router.get('/', getTouristPlaces);
router.get('/:id', getTouristPlaceById);
router.post('/', createTouristPlace);
router.put('/:id', updateTouristPlace);
router.delete('/:id', deleteTouristPlace);

export default router;

