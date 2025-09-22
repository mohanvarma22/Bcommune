import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const MyVentures: React.FC = () => {
    const { ventures, currentUser } = useContext(DataContext);
    const myVentures = ventures.filter(v => v.ownerId === currentUser?.id);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">My Ventures</h1>
            {myVentures.length > 0 ? (
                <div className="space-y-4">
                    {myVentures.map(venture => (
                        <Card key={venture.id} className="p-4">
                            <Link to={`/ventures/${venture.id}`} className="font-bold text-blue-600">{venture.name}</Link>
                            <p>{venture.tagline}</p>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-slate-500">
                    You have not created any ventures yet.
                </Card>
            )}
        </div>
    );
};

export default MyVentures;
