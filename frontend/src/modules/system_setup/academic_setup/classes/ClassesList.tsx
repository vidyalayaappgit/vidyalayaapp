"use client";

import React, { useState, useEffect } from 'react';
import {
  useClasses,
  useDeleteClass,
  useDeactivateClass,
  useAuthorizeClass,
  useSchoolId
} from './classes.hooks';
import ClassForm from './ClassesForm';
import ClassActions from './ClassActions';
import { Class, Section } from './classes.types';
import '@/styles/components/classes.css';

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
    if (!confirm('Are you sure you want to delete this class? This will also delete all sections under it.')) return;

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

  const handleDeactivate = async (id: number, schoolIdVal?: number | null) => {
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
    if (!confirm('Authorize this class? This will make it active and available for use.')) return;

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

  const handleActivate = async (id: number, schoolIdVal?: number | null) => {
    try {
      // Using authorize as activate since they serve the same purpose
      await authorizeMutation.mutateAsync({
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

  // Reset to first page when search changes
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
      <div className="class-loading-state">
        <div className="class-loading-spinner"></div>
        <p>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="class-error-state">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error Loading Data</h3>
        <p>{(error as Error).message}</p>
        <button className="class-btn-primary" onClick={() => refetch()}>
          <i className="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="class-container">
      {/* Page Header */}
      <div className="class-page-header">
        <div className="class-header-title">
          <i className="fas fa-chalkboard-user"></i>
          <div>
            <h1>Classes & Sections</h1>
            <p>Manage school classes and their sections</p>
          </div>
        </div>
        <button className="class-btn-primary" onClick={handleAdd}>
          <i className="fas fa-plus"></i>
          Add New Class
        </button>
      </div>

      {/* Search Bar */}
      <div className="class-search-bar">
        <div className="class-search-group">
          <div className="class-input-icon-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by class name, code or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button className="class-clear-search" onClick={clearSearch}>
              <i className="fas fa-times"></i> Clear
            </button>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="class-alert class-alert-success">
          <i className="fas fa-check-circle"></i>
          {successMsg}
          <button className="class-close-message" onClick={() => setSuccessMsg(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="class-alert class-alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {errorMsg}
          <button className="class-close-message" onClick={() => setErrorMsg(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="class-table-container">
        <div className="class-table-responsive">
          <table className="class-data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
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
                  <td colSpan={8} className="class-table-empty-state">
                    <div className="class-empty-state">
                      <i className="fas fa-folder-open"></i>
                      <h4>No Classes Found</h4>
                      <p>
                        {searchTerm
                          ? 'No classes match your search criteria'
                          : 'Click "Add New Class" to create one.'}
                      </p>
                      {searchTerm && (
                        <button className="class-btn-secondary" onClick={clearSearch}>
                          <i className="fas fa-undo-alt"></i> Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => {
                  const isFresh = row.status === 'FRESH' || row.status === 'DRAFT';
                  const isActive = row.status === 'ACTIVE';
                  const isExpanded = expandedClassId === row.id;
                  const sections = row.sections || [];
                  const sectionCount = sections.length;
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={isExpanded ? 'class-row-expanded-parent' : ''}>
                        <td>
                          {sectionCount > 0 && (
                            <button
                              className="class-expand-btn"
                              onClick={() => toggleExpand(row.id)}
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                            </button>
                          )}
                        </td>
                        <td data-label="Class Name">
                          <strong>{row.className || '-'}</strong>
                        </td>
                        <td data-label="Class Code">
                          <code className="class-code">{row.classCode || '-'}</code>
                        </td>
                        <td data-label="Class Number">
                          {row.classNumber}
                        </td>
                        <td data-label="Academic Level">
                          {row.academicLevel || '-'}
                        </td>
                        <td data-label="Sections">
                          <span className="class-badge class-badge-info">
                            <i className="fas fa-layer-group"></i>
                            {sectionCount} Section{sectionCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span className={`class-badge ${isActive ? 'class-badge-success' : isFresh ? 'class-badge-warning' : 'class-badge-danger'}`}>
                            <i className={`fas fa-${isActive ? 'check-circle' : isFresh ? 'pen' : 'ban'}`}></i>
                            {row.status}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <ClassActions
                            classItem={row}
                            onEdit={() => handleEdit(row)}
                            onDelete={() => handleDelete(row.id, schoolId)}
                            onActivate={() => handleActivate(row.id, schoolId)}
                            onDeactivate={() => handleDeactivate(row.id, schoolId)}
                            onAuthorize={() => handleAuthorize(row.id, schoolId)}
                            showLabels={true}
                          />
                        </td>
                      </tr>
                      
                      {/* Expanded Row with Sections */}
                      {isExpanded && sections.length > 0 && (
                        <tr className="class-expanded-row">
                          <td colSpan={8}>
                            <div className="class-sections-container">
                              <div className="class-sections-header">
                                <h4>
                                  <i className="fas fa-layer-group"></i>
                                  Sections under {row.className}
                                </h4>
                                <span className="class-sections-count">
                                  Total: {sectionCount} section{sectionCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="class-sections-grid">
                                {sections.map((section: Section) => (
                                  <div key={section.id} className="class-section-card-detail">
                                    <div className="class-section-card-header">
                                      <span className="class-section-code">{section.section_code}</span>
                                      <span className="class-section-name">{section.section_name}</span>
                                    </div>
                                    <div className="class-section-card-body">
                                      <div className="class-section-info-row">
                                        <div className="class-section-info">
                                          <i className="fas fa-building"></i>
                                          <strong>Room:</strong> {section.room_number || 'Not Assigned'}
                                        </div>
                                        <div className="class-section-info">
                                          <i className="fas fa-users"></i>
                                          <strong>Capacity:</strong> {section.capacity || 'N/A'}
                                        </div>
                                      </div>
                                      {section.current_strength !== undefined && (
                                        <div className="class-section-info">
                                          <i className="fas fa-user-friends"></i>
                                          <strong>Current Strength:</strong> {section.current_strength}
                                        </div>
                                      )}
                                      {(section.start_time || section.end_time) && (
                                        <div className="class-section-info">
                                          <i className="fas fa-clock"></i>
                                          <strong>Timing:</strong> {section.start_time || '--'} - {section.end_time || '--'}
                                        </div>
                                      )}
                                      {section.display_order && (
                                        <div className="class-section-info">
                                          <i className="fas fa-sort-numeric-up"></i>
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
          <div className="class-table-footer">
            <div className="class-table-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
            <div className="class-pagination">
              <button 
                className="class-pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  className={`class-pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                  disabled={pageNumber === '...'}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button 
                className="class-pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="class-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="class-modal-container class-modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="class-modal-header">
              <div className="class-modal-title">
                <i className="fas fa-chalkboard-user"></i>
                <div>
                  <h2>{editingClass ? 'Edit Class' : 'Create Class'}</h2>
                  <p>Add a new class with sections to the system</p>
                </div>
              </div>
              <button className="class-modal-close" onClick={() => setShowForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="class-modal-body">
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