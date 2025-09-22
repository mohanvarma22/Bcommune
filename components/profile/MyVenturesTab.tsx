import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Venture } from '../../types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { PlusIcon, EyeIcon, RadarIcon, EditIcon } from '../common/Icons';
import EditVentureModal from '../ventures/EditVentureModal';

interface MyVenturesTabProps {
    ventures: Venture[];
}

const MyVenturesTab: React.FC<MyVenturesTabProps> = ({ ventures }) => {
    const [editingVenture, setEditingVenture] = useState<Venture | null>(null);

    if (ventures.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">You haven't created any ventures yet.</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Share your idea and find collaborators.</p>
                <Link to="/create/venture" className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                    <PlusIcon />
                    Create a Venture Profile
                </Link>
            </div>
        );
    }
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-end">
                     <Link to="/create/venture" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        <PlusIcon />
                        Create New Venture
                    </Link>
                </div>
                {ventures.map(venture => (
                    <Card key={venture.id} className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-5">
                             <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar src={venture.logoUrl} alt={venture.name} size="lg" />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{venture.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{venture.tagline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Link to={`/ventures/${venture.id}`} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600" title="View Public Profile">
                                        <EyeIcon /> <span className="sm:hidden">Public View</span>
                                    </Link>
                                     <button onClick={() => setEditingVenture(venture)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600" title="Edit Venture">
                                        <EditIcon /> <span className="sm:hidden">Edit</span>
                                    </button>
                                    <Link to={`/ventures/${venture.id}/radar`} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" title="Manage Talent">
                                        <RadarIcon /> <span>Manage Talent</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {editingVenture && (
                <EditVentureModal
                    key={editingVenture.id}
                    isOpen={!!editingVenture}
                    onClose={() => setEditingVenture(null)}
                    venture={editingVenture}
                />
            )}
        </>
    );
};

export default MyVenturesTab;