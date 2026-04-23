"use client";

import React from 'react';
import { Class } from './classes.types';

interface ClassActionsProps {
  classItem: Class;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onAuthorize: () => void;
  showLabels?: boolean;
}

const ClassActions: React.FC<ClassActionsProps> = ({ 
  classItem, 
  onEdit, 
  onDelete, 
  onActivate,
  onDeactivate,
  onAuthorize,
  showLabels = true
}) => {
  const isDraft = classItem.status === 'DRAFT' || classItem.status === 'FRESH';
  const isActive = classItem.status === 'ACTIVE';
  const canEdit = isDraft;
  const canAuthorize = isDraft;
  const canActivate = isDraft;
  const canDeactivate = isActive;
  const canDelete = isDraft;

  return (
    <div className="flex space-x-2">
      {canEdit && (
        <button 
          onClick={onEdit} 
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit Class"
        >
          <i className="fas fa-pen"></i>
          {showLabels && <span className="ml-1">Edit</span>}
        </button>
      )}
      
      {canAuthorize && (
        <button 
          onClick={onAuthorize} 
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Authorize Class (Make it available for use)"
        >
          <i className="fas fa-check-circle"></i>
          {showLabels && <span className="ml-1">Authorize</span>}
        </button>
      )}
      
      {canActivate && (
        <button 
          onClick={onActivate} 
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Activate Class"
        >
          <i className="fas fa-play-circle"></i>
          {showLabels && <span className="ml-1">Activate</span>}
        </button>
      )}
      
      {canDeactivate && (
        <button 
          onClick={onDeactivate} 
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
          title="Deactivate Class (Temporarily disable)"
        >
          <i className="fas fa-ban"></i>
          {showLabels && <span className="ml-1">Deactivate</span>}
        </button>
      )}
      
      {canDelete && (
        <button 
          onClick={onDelete} 
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete Class (Permanent)"
        >
          <i className="fas fa-trash-alt"></i>
          {showLabels && <span className="ml-1">Delete</span>}
        </button>
      )}
    </div>
  );
};

export default ClassActions;