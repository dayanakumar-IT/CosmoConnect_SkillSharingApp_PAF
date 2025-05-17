import React, { useState } from 'react';
import axios from 'axios';
import LearningPlanForm from './LearningPlanForm';

const EditLearningPlan = ({ open, onClose, onSuccess, plan }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (form, file) => {
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            const cleanedForm = {
                ...form,
                duration: String(form.duration),
                price: form.price === '' ? null : Number(form.price),
                learningMaterials: plan.learningMaterials || []
            };
            formData.append('plan', JSON.stringify(cleanedForm));
            if (file) formData.append('learningMaterial', file);
            const token = localStorage.getItem('accessToken');
            await axios.put(`http://localhost:8080/api/v1/learningplan/${plan.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSuccess && onSuccess();
        } catch (err) {
            setError('Failed to update learning plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LearningPlanForm
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            initialValues={plan}
            loading={loading}
            error={error}
            submitLabel="Save"
            isEditMode={true}
        />
    );
};

export default EditLearningPlan; 