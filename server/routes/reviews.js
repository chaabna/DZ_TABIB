// routes/reviews.js
import express from 'express';
import {
    getAllReviews,
    createReview,
    getReviewById,
    updateReview,
    deleteReview
} from '../controller/reviewController.js';

const router = express.Router();

// Define routes
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing medical reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews from the database.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */

router.get('/', getAllReviews);
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Create a new review for a doctor.
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 description: The ID of the doctor.
 *               patient_id:
 *                 type: integer
 *                 description: The ID of the patient.
 *               rating:
 *                 type: integer
 *                 description: The rating given by the patient (1-5).
 *               review_text:
 *                 type: string
 *                 description: The review text.
 *               verified_consultation:
 *                 type: boolean
 *                 description: Whether the consultation is verified.
 *             example:
 *               doctor_id: 1
 *               patient_id: 1
 *               rating: 5
 *               review_text: "Great doctor!"
 *               verified_consultation: true
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created review.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/', createReview);
/**
 * @swagger
 *  /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   review_id:
 *                     type: integer
 *                   doctor_id:
 *                     type: integer
 *                   patient_id:
 *                     type: integer
 *                   rating:
 *                     type: integer
 *                   review_text:
 *                     type: string
 *                   review_date:
 *                     type: string
 *                     format: date-time
 *                   verified_consultation:
 *                     type: boolean
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getReviewById);
/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     description: Update an existing review by its ID.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               review_text:
 *                 type: string
 *               verified_consultation:
 *                 type: boolean
 *             example:
 *               rating: 4
 *               review_text: "Good service, but could be better."
 *               verified_consultation: true
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', updateReview);
/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete an existing review by its ID.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to delete.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', deleteReview);

export default router;