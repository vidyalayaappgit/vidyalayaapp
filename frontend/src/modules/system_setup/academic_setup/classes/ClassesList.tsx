"use client";

import React, { useState, useEffect } from 'react';
import {
  useClasses,
  useDeleteClass,
  useActivateClass,
  useDeactivateClass,
  useAuthorizeClass,
  useSchoolId
} from './classes.hooks';
import ClassForm from './ClassesForm';
import { Class, Section } from './classes.types';

const ClassList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>();
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const schoolId = useSchoolId();

  const { data, isLoading, error, refetch } = useClasses({
    schoolId: schoolId || undefined,
    limit: 100
  });

  const deleteMutation = useDeleteClass();
  const activateMutation = useActivateClass();
  const deactivateMutation = useDeactivateClass();
  const authorizeMutation = useAuthorizeClass();

  useEffect(() => {
    if (schoolId) refetch();
  }, [schoolId, refetch]);

  const handleAdd = () => {
    setEditingClass(undefined);
    setShowForm(true);
  };

  const handleEdit = (row: Class) => {
    setEditingClass(row);
    setShowForm(true);
  };

  const handleDelete = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Are you sure you want to permanently delete this class? This will also delete all sections under it.')) return;

    try {
      await deleteMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Class deleted successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleActivate = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Activate this class?')) return;

    try {
      await activateMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Class activated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleDeactivate = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Deactivate this class?')) return;

    try {
      await deactivateMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Class deactivated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleAuthorize = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Authorize this class? This will make it available for use.')) return;

    try {
      await authorizeMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Class authorized successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingClass(undefined);
    setSuccessMsg('Class saved successfully');
    setTimeout(() => setSuccessMsg(null), 3000);
    refetch();
  };

  const toggleExpand = (classId: number) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  // Helper to get status badge configuration (matching Academic Year)
  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase() || '';
    
    switch (statusUpper) {
      case 'ACTIVE':
        return { className: 'badge-success', icon: 'fa-star', text: 'ACTIVE' };
      case 'DRAFT':
      case 'FRESH':
        return { className: 'badge-warning', icon: 'fa-pen', text: 'DRAFT' };
      case 'INACTIVE':
        return { className: 'badge-danger', icon: 'fa-ban', text: 'INACTIVE' };
      case 'AUTHORIZED':
        return { className: 'badge-success', icon: 'fa-check-circle', text: 'AUTHORIZED' };
      default:
        return { className: 'badge-neutral', icon: 'fa-circle', text: statusUpper || 'UNKNOWN' };
    }
  };

  // Helper to determine which actions are available (matching Academic Year pattern)
  const getAvailableActions = (status: string) => {
    const statusUpper = status?.toUpperCase() || '';
    const isDraft = statusUpper === 'DRAFT' || statusUpper === 'FRESH';
    const isActive = statusUpper === 'ACTIVE';
    
    return {
      canEdit: isDraft,
      canDelete: isDraft,
      canActivate: isDraft,
      canDeactivate: isActive,
      canAuthorize: isDraft,
    };
  };

  // Filter rows based on search term
  const rows = data?.items || [];
  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.className?.toLowerCase().includes(searchLower) ||
      row.classCode?.toLowerCase().includes(searchLower) ||
      row.classNumber?.toString().includes(searchLower)
    );
  });
  
  const totalItems = filteredRows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <i className="fa-solid fa-circle-exclamation"></i>
        <h3>Error Loading Data</h3>
        <p>{(error as Error).message}</p>
        <button className="btn btn-primary" onClick={() => refetch()}>
          <i className="fa-solid fa-rotate-right"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="class-container">
      {/* Page Header - Matching Academic Year */}
      <div className="page-header">
        <div className="header-title">
          <i className="fa-solid fa-chalkboard-user"></i>
          <div>
            <h1>Classes & Sections</h1>
            <p>Manage school classes and their sections</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i>
          Add New Class
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="alert alert-success">
          <i className="fa-solid fa-check-circle"></i>
          {successMsg}
          <button className="close-message" onClick={() => setSuccessMsg(null)}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          {errorMsg}
          <button className="close-message" onClick={() => setErrorMsg(null)}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        {/* Search Bar */}
        <div className="class-search-bar">
          <div className="search-wrapper">
            <i className="fa-solid fa-search"></i>
            <input
              type="text"
              placeholder="Search by class name, code or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <i className="fa-solid fa-times"></i> Clear
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Class Name</th>
                <th>Class Code</th>
                <th>Class Number</th>
                <th>Academic Level</th>
                <th>Sections</th>
                <th>Status</th>
                <th style={{ width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty-state">
                    <div className="empty-state">
                      <i className="fa-regular fa-folder-open"></i>
                      <h4>No Classes Found</h4>
                      <p>
                        {searchTerm
                          ? 'No classes match your search criteria'
                          : 'Click "Add New Class" to create one.'}
                      </p>
                      {searchTerm && (
                        <button className="btn btn-secondary" onClick={clearSearch}>
                          <i className="fa-solid fa-undo-alt"></i> Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => {
                  const statusBadge = getStatusBadge(row.status);
                  const actions = getAvailableActions(row.status);
                  const isExpanded = expandedClassId === row.id;
                  const sections = row.sections || [];
                  const sectionCount = sections.length;
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={isExpanded ? 'row-expanded-parent' : ''}>
                        <td>
                          {sectionCount > 0 && (
                            <button
                              className="expand-btn"
                              onClick={() => toggleExpand(row.id)}
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <i className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                            </button>
                          )}
                        </td>
                        <td data-label="Class Name">
                          <strong>{row.className || '-'}</strong>
                        </td>
                        <td data-label="Class Code">
                          <code>{row.classCode || '-'}</code>
                        </td>
                        <td data-label="Class Number">
                          {row.classNumber}
                        </td>
                        <td data-label="Academic Level">
                          {row.academicLevel || '-'}
                        </td>
                        <td data-label="Sections">
                          <span className="badge badge-info">
                            <i className="fa-solid fa-layer-group"></i>
                            {sectionCount} Section{sectionCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span className={`badge ${statusBadge.className}`}>
                            <i className={`fa-solid ${statusBadge.icon}`}></i>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            {/* EDIT Button */}
                            {actions.canEdit && (
                              <button
                                className="icon-btn icon-btn--edit tooltip-top"
                                onClick={() => handleEdit(row)}
                                data-tooltip="Edit Class"
                              >
                                <i className="fa-regular fa-pen-to-square"></i>
                              </button>
                            )}
                            
                            {/* ACTIVATE Button */}
                            {actions.canActivate && (
                              <button
                                className="icon-btn icon-btn--activate tooltip-top"
                                onClick={() => handleActivate(row.id, schoolId)}
                                data-tooltip="Activate Class"
                              >
                                <i className="fa-solid fa-play-circle"></i>
                              </button>
                            )}
                            
                            {/* DEACTIVATE Button */}
                            {actions.canDeactivate && (
                              <button
                                className="icon-btn icon-btn--deactivate tooltip-top"
                                onClick={() => handleDeactivate(row.id, schoolId)}
                                data-tooltip="Deactivate Class"
                              >
                                <i className="fa-solid fa-ban"></i>
                              </button>
                            )}
                            
                            {/* AUTHORIZE Button */}
                            {actions.canAuthorize && (
                              <button
                                className="icon-btn icon-btn--authorize tooltip-top"
                                onClick={() => handleAuthorize(row.id, schoolId)}
                                data-tooltip="Authorize Class"
                              >
                                <i className="fa-solid fa-check-circle"></i>
                              </button>
                            )}
                            
                            {/* DELETE Button */}
                            {actions.canDelete && (
                              <button
                                className="icon-btn icon-btn--delete tooltip-top"
                                onClick={() => handleDelete(row.id, schoolId)}
                                data-tooltip="Delete Class"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row with Sections */}
                      {isExpanded && sections.length > 0 && (
                        <tr className="expanded-row">
                          <td colSpan={8}>
                            <div className="expanded-content">
                              <div className="expanded-header">
                                <h4>
                                  <i className="fa-solid fa-layer-group"></i>
                                  Sections under {row.className}
                                </h4>
                                <span className="expanded-count">
                                  Total: {sectionCount} section{sectionCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="sections-grid">
                                {sections.map((section: Section) => (
                                  <div key={section.id} className="section-card">
                                    <div className="section-card-header">
                                      <span className="section-code">{section.section_code}</span>
                                      <span className="section-name">{section.section_name}</span>
                                    </div>
                                    <div className="section-card-body">
                                      <div className="section-info-row">
                                        <div className="section-info">
                                          <i className="fa-solid fa-building"></i>
                                          <strong>Room:</strong> {section.room_number || 'Not Assigned'}
                                        </div>
                                        <div className="section-info">
                                          <i className="fa-solid fa-users"></i>
                                          <strong>Capacity:</strong> {section.capacity || 'N/A'}
                                        </div>
                                      </div>
                                      {(section.start_time || section.end_time) && (
                                        <div className="section-info">
                                          <i className="fa-solid fa-clock"></i>
                                          <strong>Timing:</strong> {section.start_time || '--'} - {section.end_time || '--'}
                                        </div>
                                      )}
                                      {section.display_order && (
                                        <div className="section-info">
                                          <i className="fa-solid fa-sort-numeric-up"></i>
                                          <strong>Display Order:</strong> {section.display_order}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalItems > 0 && (
          <div className="table-footer">
            <div className="table-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <i className="fa-solid fa-chevron-left"></i>
                Previous
              </button>
              
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                  disabled={pageNumber === '...'}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button 
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-container modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <i className="fa-solid fa-chalkboard-user"></i>
                <div>
                  <h2>{editingClass ? 'Edit Class' : 'Create Class'}</h2>
                  <p>Add or edit class details and sections</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <ClassForm
                initialData={editingClass}
                onSuccess={handleSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;