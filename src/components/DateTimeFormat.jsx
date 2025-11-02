import React from 'react';

function DateTimeFormat({ value }) {
    if (!value) {
        return null;
    }

    try {
        const date = new Date(value);
        return date.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (error) {
        console.error("Invalid date:", value);
        return "Invalid Date";
    }
}
export default DateTimeFormat;