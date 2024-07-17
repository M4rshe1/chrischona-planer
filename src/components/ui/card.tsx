import React from 'react';

const Card = ({children}: { children: React.ReactNode }) => {
    return <div
        className="flex justify-center items-center bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full gap-2 relative grow"
    >
        {children}
    </div>
}

export default Card;