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
        <form onSubmit={handleSubmit} className="modal-box max-w-xl space-y-6 bg-white p-6 rounded-xl shadow-lg w-ful mt-10">
            <FormField label="What are you looking for help with?" required>
                <textarea
                    required
                    className="textarea textarea-bordered w-full"
                    placeholder="Describe your problem or goal"
                    value={formData.helpWith || ''}
                    onChange={(e) => updateField('helpWith', e.target.value)}
                />
            </FormField>

            <FormField label="Why do you want to talk to an expert?" required>
                <textarea
                    required
                    className="textarea textarea-bordered w-full"
                    placeholder="Your motivation in a sentence or two"
                    value={formData.whyExpert || ''}
                    onChange={(e) => updateField('whyExpert', e.target.value)}
                />
            </FormField>

            <div className='flex flex-row justify-between'>
                <button type="button" className="btn btn-base-100" onClick={() => prevStep()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>

    )
}

export default SessionIntent