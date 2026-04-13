"use client";

// AcademicYearActions.tsx

import React from 'react';
import { AcademicYear } from './academic-year.types';

interface AcademicYearActionsProps {
  year: AcademicYear;
  onEdit: () => void;
  onDelete: () => void;
  onAuthorize: () => void;
}

const AcademicYearActions: React.FC<AcademicYearActionsProps> = ({ year, onEdit, onDelete, onAuthorize }) => {
  const canEdit = year.status === 'DRAFT';
  const canAuthorize = year.status === 'DRAFT';
  const canDelete = year.status === 'DRAFT' && !year.isCurrent;

  return (
    <div className="flex space-x-2">
      {canEdit && (
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Edit
        </button>
      )}
      {canAuthorize && (
        <button onClick={onAuthorize} className="text-green-600 hover:underline">
          Authorize
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
