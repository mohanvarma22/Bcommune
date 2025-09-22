import React from 'react';
import Card from '../common/Card';

interface AboutSectionProps {
    vision: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ vision }) => {
    return (
        <Card>
            <div className="p-6">
                 <h3 className="text-2xl font-bold text-white mb-4">About Me / Vision</h3>
                 <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{vision}</p>
            </div>
        </Card>
    );
};

export default AboutSection;