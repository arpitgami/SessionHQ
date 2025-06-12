import React from 'react'
import { FormField } from '@/component/expertform/forminputs';

const SessionIntent = ({ formData, setFormData, nextStep, prevStep }) => {

    function handleSubmit(e) {
        e.preventDefault();
        nextStep()
    }

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    return (
        <form onSubmit={handleSubmit} className="modal-box max-w-xl space-y-6 bg-base-100 p-6 rounded-xl shadow-lg w-full mt-10 border border-base-300">
            <FormField label="What are you looking for help with?" required>
                <textarea
                    className="textarea textarea-bordered w-full bg-base-200 text-base-content"
                    placeholder="Describe your problem or goal"
                    value={formData.helpWith || ''}
                    onChange={(e) => updateField('helpWith', e.target.value)}
                />
            </FormField>

            <FormField label="Why do you want to talk to an expert?" required>
                <textarea
                    className="textarea textarea-bordered w-full bg-base-200 text-base-content"
                    placeholder="Your motivation in a sentence or two"
                    value={formData.reasonToTalk || ''}
                    onChange={(e) => updateField('reasonToTalk', e.target.value)}
                />
            </FormField>

            <div className="flex flex-row justify-between">
                <button type="button" className="btn bg-base-200 text-base-content border border-base-300" onClick={() => prevStep()}>
                    Back
                </button>
                <button type="submit" className="btn btn-primary text-primary-content">
                    Save
                </button>
            </div>
        </form>

    )
}

export default SessionIntent