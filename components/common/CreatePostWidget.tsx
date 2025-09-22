import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Avatar from './Avatar';
import { DataContext } from '../../context/DataContext';

const CreatePostWidget: React.FC = () => {
    const { currentUser, activeProfile } = useContext(DataContext);
    const isCompanyActive = activeProfile.type === 'company';

    if (!currentUser) return null;

    const placeholderText = isCompanyActive 
        ? `Share an update for ${activeProfile.name}...`
        : `Share your story, ${currentUser.name.split(' ')[0]}...`;

    return (
        <Card className="p-4">
            <div className="flex items-center gap-4">
                <Link to={`/profile/${currentUser.id}`}>
                    <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="md" />
                </Link>
                <div className="flex-1">
                    <Link to="/create/story" className="block w-full text-left text-slate-500 bg-slate-100 border border-slate-300 rounded-full px-4 py-2 hover:bg-slate-200 transition">
                        {placeholderText}
                    </Link>
                </div>
                {isCompanyActive && (
                    <Link 
                        to="/create/job" 
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition hidden sm:block"
                        title="Post a new job"
                    >
                        Post Job
                    </Link>
                )}
            </div>
        </Card>
    );
};

export default CreatePostWidget;