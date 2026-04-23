"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  useSubjects,
  useDeleteSubject,
  useDeactivateSubject,
  useActivateSubject,
  useSchoolId,
  useSubjectControls,
  useStatusOptions
} from './subjects.hooks';
import SubjectsForm from './SubjectsForm';
import SubjectActions from './SubjectActions';
import { Subject, ClassMapping, StatusOption } from './subjects.types';
import '@/styles/components/subjects.css';

const SubjectsList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [classIdFilter, setClassIdFilter] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const schoolId = useSchoolId();
  const { controls, isLoading: controlsLoading } = useSubjectControls();
  // Don't block UI on status options loading
  const { statusOptions, isLoading: statusOptionsLoading } = useStatusOptions(8);

  const { data, isLoading, error, refetch } = useSubjects({
    schoolId: schoolId || undefined,
    status: statusFilter,
    subjectType: typeFilter,
    classId: classIdFilter,
    limit: 100
  });

  const deleteMutation = useDeleteSubject();
  const deactivateMutation = useDeactivateSubject();
  const activateMutation = useActivateSubject();

  // Permission checks
  const canCreate = controls.includes('create');
  const canUpdate = controls.includes('update');
  const canDelete = controls.includes('delete');
  const canActivate = controls.includes('activate');
  const canDeactivate = controls.includes('deactivate');

  // Create a map for quick status lookups (with fallback)
  const statusMap = useMemo(() => {
    const map = new Map<number, StatusOption>();
    statusOptions.forEach(option => {
      map.set(option.status_id, option);
    });
    return map;
  }, [statusOptions]);

  // Helper function to get status display info (with fallback)
  const getStatusDisplay = (statusValue: string | number) => {
    // If statusValue is a string (like 'ACTIVE'), find by status_name
    if (typeof statusValue === 'string') {
      const status = statusOptions.find(
        s => s.status_name === statusValue
      );
      if (status) {
        return {
          id: status.status_id,
          name: status.status_name,
          description: status.status_desc
        };
      }
    } else {
      // If it's a number, find by status_id
      const status = statusMap.get(statusValue);
      if (status) {
        return {
          id: status.status_id,
          name: status.status_name,
          description: status.status_desc
        };
      }
    }
    
    // Fallback for unknown status - match the database values
    if (statusValue === 'ACTIVE' || statusValue === 2) {
      return {
        id: 2,
        name: 'ACTIVE',
        description: 'Subject is active and available for use'
      };
    }
    if (statusValue === 'DRAFT' || statusValue === 1) {
      return {
        id: 1,
        name: 'DRAFT',
        description: 'Subject in draft mode - not yet ready for use'
      };
    }
    if (statusValue === 'INACTIVE' || statusValue === 3) {
      return {
        id: 3,
        name: 'INACTIVE',
        description: 'Subject is inactive/archived'
      };
    }
    
    return {
      id: 0,
      name: String(statusValue),
      description: ''
    };
  };

  useEffect(() => {
    if (schoolId) {
      refetch();
    }
  }, [schoolId, statusFilter, typeFilter, classIdFilter, refetch]);

  const handleAdd = () => {
    if (!canCreate) {
      setErrorMsg('You do not have permission to create subjects');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    setEditingSubject(undefined);
    setShowForm(true);
  };

  const handleEdit = (row: Subject) => {
    if (!canUpdate) {
      setErrorMsg('You do not have permission to edit subjects');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    setEditingSubject(row);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete) {
      setErrorMsg('You do not have permission to delete subjects');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    
    if (!confirm('Are you sure you want to delete this subject? This will also delete all class mappings.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        id,
        schoolId: schoolId!
      });
      setSuccessMsg('Subject deleted successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleActivate = async (id: number) => {
    if (!canActivate) {
      setErrorMsg('You do not have permission to activate subjects');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    
    try {
      await activateMutation.mutateAsync({
        id,
        schoolId: schoolId!
      });
      setSuccessMsg('Subject activated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!canDeactivate) {
      setErrorMsg('You do not have permission to deactivate subjects');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    
    try {
      await deactivateMutation.mutateAsync({
        id,
        schoolId: schoolId!
      });
      setSuccessMsg('Subject deactivated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSubject(undefined);
    setSuccessMsg('Subject saved successfully');
    setTimeout(() => setSuccessMsg(null), 3000);
    refetch();
  };

  const toggleExpand = (subjectId: number) => {
    setExpandedSubjectId(expandedSubjectId === subjectId ? null : subjectId);
  };

  // Filter rows based on search term
  const rows = data?.items || [];
  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.subjectCode.toLowerCase().includes(searchLower) ||
      row.subjectName.toLowerCase().includes(searchLower) ||
      (row.subjectShortName && row.subjectShortName.toLowerCase().includes(searchLower)) ||
      (row.subjectType && row.subjectType.toLowerCase().includes(searchLower))
    );
  });
  
  const totalItems = filteredRows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, classIdFilter, searchTerm]);

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

  const clearFilters = () => {
    setStatusFilter(undefined);
    setTypeFilter(undefined);
    setClassIdFilter(undefined);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Don't block on statusOptionsLoading - only block on actual data loading
  if (isLoading || controlsLoading) {
    return (
      <div className="subject-loading-state">
        <div className="subject-loading-spinner"></div>
        <p>Loading subjects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subject-error-state">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error Loading Data</h3>
        <p>{(error as Error).message}</p>
        <button className="subject-btn-primary" onClick={() => refetch()}>
          <i className="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="subject-container">
      {/* Page Header */}
      <div className="subject-page-header">
        <div className="subject-header-title">
          <i className="fas fa-book-open"></i>
          <div>
            <h1>Subjects Management</h1>
            <p>Manage school subjects and their class mappings</p>
          </div>
        </div>
        {canCreate && (
          <button className="subject-btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Add New Subject
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="subject-filters-bar">
        <div className="subject-filter-group">
          <label>Search:</label>
          <div className="subject-input-icon-wrapper">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>
        </div>
        <div className="subject-filter-group">
          <label>Status:</label>
          <select 
            onChange={(e) => setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined)} 
            value={statusFilter || ''}
          >
            <option value="">All</option>
            {/* Always show options - use fallback if statusOptions is empty */}
            {(statusOptions.length > 0 ? statusOptions : [
              { status_id: 1, status_name: 'DRAFT', status_desc: 'Draft mode' },
              { status_id: 2, status_name: 'ACTIVE', status_desc: 'Active' },
              { status_id: 3, status_name: 'INACTIVE', status_desc: 'Inactive' },
            ]).map((status) => (
              <option key={status.status_id} value={status.status_id}>
                {status.status_name}
              </option>
            ))}
          </select>
          {statusOptionsLoading && (
            <span className="subject-loading-indicator" style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </span>
          )}
        </div>
        <div className="subject-filter-group">
          <label>Type:</label>
          <select onChange={(e) => setTypeFilter(e.target.value || undefined)} value={typeFilter || ''}>
            <option value="">All</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
            <option value="Both">Both</option>
            <option value="Remedial">Remedial</option>
          </select>
        </div>
        <div className="subject-filter-group">
          <label>Class ID:</label>
          <input
            type="number"
            placeholder="Filter by class"
            value={classIdFilter || ''}
            onChange={(e) => setClassIdFilter(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
          />
        </div>
        <button className="subject-btn-secondary" onClick={clearFilters}>
          <i className="fas fa-undo-alt"></i> Reset
        </button>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="subject-alert subject-alert-success">
          <i className="fas fa-check-circle"></i>
          {successMsg}
          <button className="subject-close-message" onClick={() => setSuccessMsg(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="subject-alert subject-alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {errorMsg}
          <button className="subject-close-message" onClick={() => setErrorMsg(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="subject-table-container">
        <div className="subject-table-responsive">
          <table className="subject-data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Mappings</th>
                <th>Status</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="subject-table-empty-state">
                    <div className="subject-empty-state">
                      <i className="fas fa-folder-open"></i>
                      <h4>No Subjects Found</h4>
                      <p>
                        {searchTerm || statusFilter || typeFilter || classIdFilter
                          ? 'Try adjusting your filters'
                          : 'Click "Add New Subject" to create one.'}
                      </p>
                      {(searchTerm || statusFilter || typeFilter || classIdFilter) && (
                        <button className="subject-btn-secondary" onClick={clearFilters}>
                          <i className="fas fa-undo-alt"></i> Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => {
                  const isExpanded = expandedSubjectId === row.id;
                  const mappings = row.classMappings || [];
                  const mappingCount = mappings.length;
                  const statusInfo = getStatusDisplay(row.status);
                  
                  // Determine status styling based on status name
                  const getStatusClass = (statusName: string) => {
                    switch(statusName) {
                      case 'ACTIVE': return 'subject-badge-success';
                      case 'DRAFT': return 'subject-badge-warning';
                      default: return 'subject-badge-danger';
                    }
                  };
                  
                  const getStatusIcon = (statusName: string) => {
                    switch(statusName) {
                      case 'ACTIVE': return 'check-circle';
                      case 'DRAFT': return 'pen';
                      default: return 'ban';
                    }
                  };
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={isExpanded ? 'subject-row-expanded-parent' : ''}>
                        <td>
                          {mappingCount > 0 && (
                            <button
                              className="subject-expand-btn"
                              onClick={() => toggleExpand(row.id)}
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                            </button>
                          )}
                        </td>
                        <td data-label="Subject Code">
                          <code className="subject-code">{row.subjectCode}</code>
                        </td>
                        <td data-label="Subject Name">
                          <strong>{row.subjectName}</strong>
                          {row.subjectShortName && (
                            <span className="subject-short-name">({row.subjectShortName})</span>
                          )}
                        </td>
                        <td data-label="Type">
                          <span className="subject-badge subject-badge-info">{row.subjectType || 'N/A'}</span>
                        </td>
                        <td data-label="Category">
                          {row.subjectCategory || '-'}
                        </td>
                        <td data-label="Mappings">
                          <span className="subject-badge subject-badge-primary">
                            <i className="fas fa-layer-group"></i>
                            {mappingCount} Class{mappingCount !== 1 ? 'es' : ''}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span 
                            className={`subject-badge ${getStatusClass(statusInfo.name)}`} 
                            title={statusInfo.description}
                          >
                            <i className={`fas fa-${getStatusIcon(statusInfo.name)}`}></i>
                            {statusInfo.name}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <SubjectActions
                            subject={row}
                            onEdit={() => handleEdit(row)}
                            onDelete={() => handleDelete(row.id)}
                            onActivate={() => handleActivate(row.id)}
                            onDeactivate={() => handleDeactivate(row.id)}
                            showLabels={true}
                          />
                        </td>
                      </tr>
                      
                      {/* Expanded Row with Class Mappings */}
                      {isExpanded && mappings.length > 0 && (
                        <tr className="subject-expanded-row">
                          <td colSpan={8}>
                            <div className="subject-mappings-container">
                              <div className="subject-mappings-header">
                                <h4>
                                  <i className="fas fa-layer-group"></i>
                                  Class Mappings for {row.subjectName}
                                </h4>
                                <span className="subject-mappings-count">
                                  Total: {mappingCount} mapping{mappingCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="subject-mappings-grid">
                                {mappings.map((mapping: ClassMapping) => (
                                  <div key={mapping.id} className="subject-mapping-card-detail">
                                    <div className="subject-mapping-card-header">
                                      <span className="subject-mapping-class">
                                        <i className="fas fa-chalkboard"></i>
                                        Class {mapping.class_number}: {mapping.class_name}
                                      </span>
                                      <span className={`subject-badge ${mapping.is_taught ? 'subject-badge-success' : 'subject-badge-warning'}`}>
                                        <i className={`fas fa-${mapping.is_taught ? 'check' : 'times'}`}></i>
                                        {mapping.is_taught ? 'Taught' : 'Not Taught'}
                                      </span>
                                    </div>
                                    <div className="subject-mapping-card-body">
                                      <div className="subject-mapping-info-row">
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-sort-numeric-up"></i>
                                          <strong>Number:</strong> {mapping.subject_number}
                                        </div>
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-clock"></i>
                                          <strong>Hours:</strong> {mapping.theory_hours_per_week}h theory / {mapping.practical_hours_per_week}h practical
                                        </div>
                                      </div>
                                      <div className="subject-mapping-info-row">
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-star"></i>
                                          <strong>Credits:</strong> {mapping.theory_credits} + {mapping.practical_credits} = {mapping.total_credits}
                                        </div>
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-check-double"></i>
                                          <strong>Passing:</strong> {mapping.passing_marks_theory}/{mapping.max_marks_theory} theory, {mapping.passing_marks_practical}/{mapping.max_marks_practical} practical
                                        </div>
                                      </div>
                                      <div className="subject-mapping-info-row">
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-percent"></i>
                                          <strong>Min Attendance:</strong> {mapping.min_attendance_percent}%
                                        </div>
                                        {mapping.suggested_teacher_id && (
                                          <div className="subject-mapping-info">
                                            <i className="fas fa-chalkboard-user"></i>
                                            <strong>Teacher ID:</strong> {mapping.suggested_teacher_id}
                                          </div>
                                        )}
                                        <div className="subject-mapping-info">
                                          <i className="fas fa-flag-checkered"></i>
                                          <strong>Optional:</strong> {mapping.is_optional ? 'Yes' : 'No'}
                                        </div>
                                      </div>
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
          <div className="subject-table-footer">
            <div className="subject-table-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
            <div className="subject-pagination">
              <button 
                className="subject-pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  className={`subject-pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                  disabled={pageNumber === '...'}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button 
                className="subject-pagination-btn"
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
        <div className="subject-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="subject-modal-container subject-modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="subject-modal-header">
              <div className="subject-modal-title">
                <i className="fas fa-book-open"></i>
                <div>
                  <h2>{editingSubject ? 'Edit Subject' : 'Create Subject'}</h2>
                  <p>Configure subject details and class mappings</p>
                </div>
              </div>
              <button className="subject-modal-close" onClick={() => setShowForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="subject-modal-body">
              <SubjectsForm
                initialData={editingSubject}
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

export default SubjectsList;