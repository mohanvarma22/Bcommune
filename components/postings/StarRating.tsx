import React, { useState } from 'react';
import { StarIcon } from '../common/Icons';

interface StarRatingProps {
    rating: number;
    onRate: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                    <StarIcon
                        solid={(hoverRating || rating) >= star}
                        className={`w-5 h-5 ${(hoverRating || rating) >= star ? 'text-yellow-400' : ''}`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;