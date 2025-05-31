'use client';
import { FormField } from './forminputs';

export default function Step3({ formData, updateField }) {
    return (
        <div className="space-y-4">

            <FormField label="Set Password" required>
                <input
                    type="password"
                    className="input"
                    placeholder="Enter password"
                    value={formData.password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                />
            </FormField>

            <FormField label="Confirm Password" required>
                <input
                    type="password"
                    className="input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
            </FormField>

        </div>
    );
}
