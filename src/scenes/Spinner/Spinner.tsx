// Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div
            style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(0, 0, 0, 0.1)',
                borderTopColor: '#007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }}
        ></div>
    </div>
);

export default Spinner;
