'use client';
import { FormField, MultiSelect } from './forminputs';

export default function Step1({ formData, updateField }) {
    return (
        <div className="space-y-4">

            <FormField label="Full Name" required>
                <input
                    type="text"
                    className="input"
                    placeholder="Your full name"
                    value={formData.fullName || ''}
                    onChange={(e) => updateField('fullName', e.target.value)}
                />
            </FormField>

            <FormField label="Email" required>
                <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                />
            </FormField>

            <FormField label="LinkedIn Profile" required>
                <input
                    type="url"
                    className="input"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin || ''}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                />
            </FormField>

            <FormField label="Twitter URL" required={false}>
                <input
                    type="url"
                    className="input"
                    placeholder="https://twitter.com/..."
                    value={formData.twitter || ''}
                    onChange={(e) => updateField('twitter', e.target.value)}
                />
            </FormField>

            <FormField label="Headline" required>
                <input
                    type="text"
                    className="input"
                    placeholder="e.g. AI Researcher & ML Expert"
                    value={formData.headline || ''}
                    onChange={(e) => updateField('headline', e.target.value)}
                />
            </FormField>

            <MultiSelect
                label="Areas of Expertise"
                required
                options={['Web Development', 'UI/UX', 'AI/ML', 'Marketing', 'DevOps']}
                value={formData.expertise || []}
                onChange={(val) => updateField('expertise', val)}
            />

            <FormField label="Years of Experience" required>
                <select
                    className="select"
                    value={formData.experience || ''}
                    onChange={(e) => updateField('experience', e.target.value)}
                >
                    <option value="" disabled>Pick one</option>
                    <option>0–1</option>
                    <option>2–5</option>
                    <option>5–10</option>
                    <option>10+</option>
                </select>
            </FormField>

        </div>
    );
}
