// controllers/reviewController.js
import Review from '../models/Review.js';

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.getAll();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new review
export const createReview = async (req, res) => {
    try {
        const newReviewId = await Review.create(req.body);
        res.status(201).json({ id: newReviewId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a review by ID
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.getById(req.params.id);
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Update a review
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { doctor_id, patient_id, rating, review_text, verified_consultation } = req.body;

    try {
        // Step 1: Check if the review exists
        const review = await Review.getById(id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Step 2: Validate patient_id (if provided)
        if (patient_id !== undefined) {
            const [patient] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [patient_id]);
            if (patient.length === 0) {
                return res.status(400).json({ error: 'Invalid patient_id' });
            }
        }

        // Step 3: Prepare the fields to update
        const fieldsToUpdate = {};
        if (doctor_id !== undefined) fieldsToUpdate.doctor_id = doctor_id;
        if (patient_id !== undefined) fieldsToUpdate.patient_id = patient_id;
        if (rating !== undefined) fieldsToUpdate.rating = rating;
        if (review_text !== undefined) fieldsToUpdate.review_text = review_text;
        if (verified_consultation !== undefined) fieldsToUpdate.verified_consultation = verified_consultation;

        // Step 4: Update the review with the provided fields
        await Review.update(id, fieldsToUpdate);
        res.json({ message: 'Review updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        await Review.delete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};