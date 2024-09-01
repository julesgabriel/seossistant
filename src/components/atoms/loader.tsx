import React from 'react';

export const LoadingSpinner = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: "0 auto", background: "none", display: "block", maxHeight: "100px" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <circle
                cx="50"
                cy="50"
                r="32"
                strokeWidth="8"
                stroke="#4f46e5"
                strokeDasharray="50.26548245743669 50.26548245743669"
                fill="none"
                strokeLinecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                />
            </circle>
        </svg>
    );
};
