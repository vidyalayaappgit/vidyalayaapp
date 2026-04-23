"use client";

import React from 'react';
import { Subject } from './subjects.types';

interface SubjectActionsProps {
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  showLabels?: boolean;
}

const SubjectActions: React.FC<SubjectActionsProps> = ({ 
  subject, 
  onEdit, 
  onDelete, 
  onActivate,
  onDeactivate,
  showLabels = true
}) => {
  const isDraft = subject.status === 'DRAFT';
  const isActive = subject.status === 'ACTIVE';
  const canEdit = isDraft;
  const canActivate = isDraft;
  const canDeactivate = isActive;
  const canDelete = isDraft;

  return (
    <div className="flex space-x-2">
      {canEdit && (
        <button 
          onClick={onEdit} 
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit Subject"
        >
          <i className="fas fa-pen"></i>
          {showLabels && <span className="ml-1">Edit</span>}
        </button>
      )}
      
      {canActivate && (
        <button 
          onClick={onActivate} 
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Activate Subject (Make it available for use)"
        >
          <i className="fas fa-check-circle"></i>
          {showLabels && <span className="ml-1">Activate</span>}
        </button>
      )}
      
      {canDeactivate && (
        <button 
          onClick={onDeactivate} 
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
          title="Deactivate Subject (Temporarily disable)"
        >
          <i className="fas fa-ban"></i>
          {showLabels && <span className="ml-1">Deactivate</span>}
        </button>
      )}
      
      {canDelete && (
        <button 
          onClick={onDelete} 
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete Subject (Permanent)"
        >
          <i className="fas fa-trash-alt"></i>
          {showLabels && <span className="ml-1">Delete</span>}
        </button>
      )}
    </div>
  );
};

export default SubjectActions;