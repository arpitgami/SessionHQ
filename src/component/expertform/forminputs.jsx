'use client';
import { useState, useEffect } from 'react';

export function FormField({ label, required, children }) {
    return (
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend font-semibold text-base">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </legend>
            {children}
            <p className="label text-xs mt-1">{required ? 'Required' : 'Optional'}</p>
        </fieldset>
    );
}



export function MultiSelect({ label, options = [], required, value = [], onChange }) {
    const [selected, setSelected] = useState(value || []);

    useEffect(() => {
        setSelected(value || []);
    }, [value]);

    const toggleOption = (val) => {
        const updated = selected.includes(val)
            ? selected.filter((v) => v !== val)
            : [...selected, val];
        setSelected(updated);
        onChange?.(updated); // lift state up
    };

    return (
        <FormField label={label} required={required}>
            <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option) => (
                    <label key={option} className="cursor-pointer">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={selected.includes(option)}
                            onChange={() => toggleOption(option)}
                        />
                        <span
                            className={`badge badge-outline px-3 py-2 ${selected.includes(option) ? 'bg-base-300' : 'bg-base-100'
                                }`}
                        >
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </FormField>
    );
}
