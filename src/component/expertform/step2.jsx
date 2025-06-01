'use client';
import { FormField, MultiSelect } from './forminputs';

export default function Step2({ formData, updateField, setExpertImage, expertImage }) {
    return (
        <div className="space-y-4">

            <FormField label="Upload Profile Photo" required={false}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setExpertImage(e.target.files?.[0])}
                    className="file-input file-input-bordered w-full"
                />
            </FormField>

            {expertImage && <p className="text-sm mt-2 text-gray-600">
                Selected: <strong>{expertImage.name}</strong>
            </p>}

            <FormField label="Short Bio" required>
                <textarea
                    className="textarea"
                    placeholder="Tell us about yourself"
                    value={formData.bio || ''}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={4}
                />
            </FormField>

            <MultiSelect
                label="Languages Spoken"
                required={false}
                options={['English', 'Hindi', 'Spanish', 'French', 'Mandarin']}
                value={formData.languages || []}
                onChange={(val) => updateField('languages', val)}
            />

            <FormField label="Hourly Rate (USD)" required>
                <input
                    type="number"
                    className="input"
                    placeholder="Enter your rate"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => updateField('hourlyRate', e.target.value)}
                    min="0"
                />
            </FormField>

            {/* Social Proofs could be a more complex component, but basic input list works too */}
            <FormField label="Social Proof Links (max 5)" required={false}>
                {(formData.socialProofs || []).map((proof, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                        <input
                            type="url"
                            className="input flex-1"
                            placeholder="https://..."
                            value={proof.url}
                            onChange={(e) => {
                                const updated = [...formData.socialProofs];
                                updated[idx].url = e.target.value;
                                updateField('socialProofs', updated);
                            }}
                        />
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder="Description"
                            value={proof.description || ''}
                            onChange={(e) => {
                                const updated = [...formData.socialProofs];
                                updated[idx].description = e.target.value;
                                updateField('socialProofs', updated);
                            }}
                        />
                    </div>
                ))}

                {(formData.socialProofs?.length || 0) < 5 && (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                            updateField('socialProofs', [
                                ...(formData.socialProofs || []),
                                { url: '', description: '' },
                            ])
                        }
                    >
                        + Add Link
                    </button>
                )}
            </FormField>
        </div>
    );
}
