import React, { useState } from 'react';
import { FormField } from '@/component/expertform/forminputs';


const AboutYou = ({ formData, setFormData, nextStep, prevStep }) => {


    function handleSubmit(e) {
        e.preventDefault();
        nextStep()
    }

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>

            <form onSubmit={handleSubmit} className="modal-box max-w-xl space-y-6 bg-white p-6 ">
                <FormField label="Role / Title" required>
                    <input
                        required
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g. Solo founder, Product Manager"
                        value={formData.role || ''}
                        onChange={(e) => updateField('role', e.target.value)}
                    />
                </FormField>

                <FormField label="Industry or Domain" required>
                    <input
                        required
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g. Fintech, SaaS"
                        value={formData.industry || ''}
                        onChange={(e) => updateField('industry', e.target.value)}
                    />
                </FormField>

                <FormField label="Stage of Work" required>
                    <select
                        required
                        className="select select-bordered w-full"
                        value={formData.stage || ''}
                        onChange={(e) => updateField('stage', e.target.value)}
                    >
                        <option value="">Select a stage</option>
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Raising Seed">Raising Seed</option>
                        <option value="Scaling">Scaling</option>
                    </select>
                </FormField>

                <FormField label="About Startup" required>
                    <textarea
                        required
                        className="textarea textarea-bordered w-full"
                        placeholder="1–2 lines about what you do"
                        value={formData.aboutStartup || ''}
                        onChange={(e) => updateField('aboutStartup', e.target.value)}
                    />
                </FormField>
                <div className='flex flex-row justify-between'>
                    <button type="button" className="btn btn-base-100" onClick={() => prevStep()}>Back</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </>

    )
}

export default AboutYou