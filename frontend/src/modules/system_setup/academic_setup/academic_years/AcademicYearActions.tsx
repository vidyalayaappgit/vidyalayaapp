"use client";

// AcademicYearActions.tsx

import React from 'react';
import { AcademicYear } from './academic-year.types';

interface AcademicYearActionsProps {
  year: AcademicYear;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

const AcademicYearActions: React.FC<AcademicYearActionsProps> = ({ 
  year, 
  onEdit, 
  onDelete, 
  onActivate,
  onComplete,
  onCancel 
}) => {
  const status = year.status?.toUpperCase() || '';
  
  // Status-based action availability
  const canEdit = status === 'DRAFT' || status === 'CANCELLED';
  const canDelete = status === 'DRAFT';  // Only DRAFT can be deleted
  const canActivate = status === 'DRAFT';  // Only DRAFT can be activated
  const canComplete = status === 'ACTIVE';  // Only ACTIVE can be completed
  const canCancel = status === 'ACTIVE';  // Only ACTIVE can be cancelled (not DRAFT)

  return (
    <div className="flex space-x-2">
      {canEdit && (
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Edit
        </button>
      )}
      {canActivate && (
        <button onClick={onActivate} className="text-green-600 hover:underline">
          Activate
        </button>
      )}
      {canComplete && (
        <button onClick={onComplete} className="text-purple-600 hover:underline">
          Complete
        </button>
      )}
      {canCancel && (
        <button onClick={onCancel} className="text-orange-600 hover:underline">
          Cancel
        </button>
      )}
      {canDelete && (
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      )}
    </div>
  );
};

export default AcademicYearActions;