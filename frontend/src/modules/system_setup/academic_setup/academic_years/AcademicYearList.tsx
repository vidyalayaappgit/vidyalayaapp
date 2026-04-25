"use client";

import React, { useState, useEffect } from 'react';
import {
  useAcademicYears,
  useDeleteAcademicYear,
  useActivateAcademicYear,
  useCompleteAcademicYear,
  useCancelAcademicYear,
  useSchoolId
} from './academic-year.hooks';
import AcademicYearForm from './AcademicYearForm';
import { AcademicYear } from './academic-year.types';

const AcademicYearList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const schoolId = useSchoolId();

  const { data, isLoading, error, refetch } = useAcademicYears({
    schoolId: schoolId || undefined,
    limit: 100
  });

  const deleteMutation = useDeleteAcademicYear();
  const activateMutation = useActivateAcademicYear();
  const completeMutation = useCompleteAcademicYear();
  const cancelMutation = useCancelAcademicYear();

  useEffect(() => {
    if (schoolId) refetch();
  }, [schoolId, refetch]);

  const handleAdd = () => {
    setEditingYear(undefined);
    setShowForm(true);
  };

  const handleEdit = (row: AcademicYear) => {
    setEditingYear(row);
    setShowForm(true);
  };

  const handleDelete = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Are you sure you want to permanently delete this DRAFT academic year? This action cannot be undone.')) return;

    try {
      await deleteMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Academic year deleted successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleActivate = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Activate this academic year? It will become the current academic year and only one academic year can be active at a time.')) return;

    try {
      await activateMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Academic year activated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleComplete = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Mark this ACTIVE academic year as COMPLETED? This action cannot be undone.')) return;

    try {
      await completeMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Academic year completed successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleCancel = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Cancel this ACTIVE academic year? This action cannot be undone and the year will be marked as CANCELLED.')) return;

    try {
      await cancelMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Academic year cancelled successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      refetch();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingYear(undefined);
    setSuccessMsg('Academic year saved successfully');
    setTimeout(() => setSuccessMsg(null), 3000);
    refetch();
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  };

  // Helper function to display terms
  const renderTerms = (terms: any[] | undefined) => {
    if (!terms || terms.length === 0) return <span style={{ color: 'var(--text-secondary)' }}>-</span>;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {terms.map((term, idx) => (
          <span 
            key={`term-${idx}-${term.term_code || idx}`}
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              borderRadius: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {term.term_name} ({formatDate(term.start_date)} - {formatDate(term.end_date)})
          </span>
        ))}
      </div>
    );
  };

  // Helper to get status badge configuration
  const getStatusBadge = (status: string, isCurrent: boolean) => {
    const statusUpper = status?.toUpperCase() || '';
    
    switch (statusUpper) {
      case 'ACTIVE':
        return { className: 'badge-success', icon: 'fa-star', text: 'ACTIVE' };
      case 'DRAFT':
        return { className: 'badge-warning', icon: 'fa-pen', text: 'DRAFT' };
      case 'COMPLETED':
        return { className: 'badge-info', icon: 'fa-check-circle', text: 'COMPLETED' };
      case 'CANCELLED':
        return { className: 'badge-danger', icon: 'fa-ban', text: 'CANCELLED' };
      default:
        return { className: 'badge-neutral', icon: 'fa-circle', text: statusUpper || 'UNKNOWN' };
    }
  };

  // Helper to determine which actions are available based on status
  const getAvailableActions = (status: string) => {
    const statusUpper = status?.toUpperCase() || '';
    
    return {
      canEdit: statusUpper === 'DRAFT' || statusUpper === 'CANCELLED',
      canDelete: statusUpper === 'DRAFT',
      canActivate: statusUpper === 'DRAFT',
      canComplete: statusUpper === 'ACTIVE',
      canCancel: statusUpper === 'ACTIVE',
    };
  };

  const rows = data?.items || [];
  const totalItems = data?.total || rows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Generate page numbers
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

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading academic years...</p>
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
    <div className="academic-year-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <i className="fa-solid fa-calendar-alt"></i>
          <div>
            <h1>Academic Years</h1>
            <p>Manage school academic years, sessions, and terms</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i>
          Add New Academic Year
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
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year Name</th>
                <th>Year Code</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Terms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr key="empty-row">
                  <td colSpan={7} className="table-empty-state">
                    <div className="empty-state">
                      <i className="fa-regular fa-folder-open"></i>
                      <h4>No Academic Years Found</h4>
                      <p>Click "Add New Academic Year" to create one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row, index) => {
                  // Use a unique key combining id and index as fallback
                  const rowKey = row?.id ? `year-${row.id}` : `year-${index}-${Date.now()}`;
                  const statusBadge = getStatusBadge(row.status, row.isCurrent);
                  const actions = getAvailableActions(row.status);
                  
                  return (
                    <tr key={rowKey}>
                      <td data-label="Year Name">
                        <strong>{row.yearName || '-'}</strong>
                        {row.isCurrent && (
                          <span className="badge-current" style={{ marginLeft: '0.5rem' }}>
                            <i className="fa-solid fa-star"></i> Current
                          </span>
                        )}
                      </td>
                      <td data-label="Year Code">
                        <code>{row.yearCode || '-'}</code>
                      </td>
                      <td data-label="Start Date">
                        {formatDate(row.startDate)}
                      </td>
                      <td data-label="End Date">
                        {formatDate(row.endDate)}
                      </td>
                      <td data-label="Terms">
                        {renderTerms(row.terms)}
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${statusBadge.className}`}>
                          <i className={`fa-solid ${statusBadge.icon}`}></i>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {/* EDIT Button */}
                          {actions.canEdit ? (
                            <button
                              key={`edit-${rowKey}`}
                              className="icon-btn icon-btn--edit tooltip-top"
                              onClick={() => handleEdit(row)}
                              data-tooltip="Edit Academic Year"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          ) : (
                            <button
                              key={`edit-disabled-${rowKey}`}
                              className="icon-btn icon-btn--edit disabled tooltip-top"
                              disabled
                              data-tooltip="Cannot edit academic year with this status"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          )}
                          
                          {/* ACTIVATE Button */}
                          {actions.canActivate ? (
                            <button
                              key={`activate-${rowKey}`}
                              className="icon-btn icon-btn--activate tooltip-top"
                              onClick={() => handleActivate(row.id!, row.schoolId)}
                              data-tooltip="Activate as Current Academic Year"
                            >
                              <i className="fa-solid fa-check-circle"></i>
                            </button>
                          ) : (
                            <button
                              key={`activate-disabled-${rowKey}`}
                              className="icon-btn icon-btn--activate disabled tooltip-top"
                              disabled
                              data-tooltip={row.status === 'ACTIVE' ? "Already active" : "Cannot activate this status"}
                            >
                              <i className="fa-solid fa-check-circle"></i>
                            </button>
                          )}
                          
                          {/* COMPLETE Button */}
                          {actions.canComplete ? (
                            <button
                              key={`complete-${rowKey}`}
                              className="icon-btn icon-btn--complete tooltip-top"
                              onClick={() => handleComplete(row.id!, row.schoolId)}
                              data-tooltip="Mark as Completed"
                            >
                              <i className="fa-solid fa-flag-checkered"></i>
                            </button>
                          ) : null}
                          
                          {/* CANCEL Button */}
                          {actions.canCancel ? (
                            <button
                              key={`cancel-${rowKey}`}
                              className="icon-btn icon-btn--cancel tooltip-top"
                              onClick={() => handleCancel(row.id!, row.schoolId)}
                              data-tooltip="Cancel Academic Year"
                            >
                              <i className="fa-solid fa-ban"></i>
                            </button>
                          ) : null}
                          
                          {/* DELETE Button (only for DRAFT) */}
                          {actions.canDelete ? (
                            <button
                              key={`delete-${rowKey}`}
                              className="icon-btn icon-btn--delete tooltip-top"
                              onClick={() => handleDelete(row.id!, row.schoolId)}
                              data-tooltip="Permanently Delete"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          ) : null}
                        </div>
                       </td>
                    </tr>
                  );
                })
              )}
            </tbody>
           </table>
        </div>
        
        {/* Table Footer with Pagination */}
        {rows.length > 0 && (
          <div className="table-footer" key="table-footer">
            <div className="table-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
            <div className="pagination">
              <button 
                key="prev-page"
                className="pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <i className="fa-solid fa-chevron-left"></i>
                Previous
              </button>
              
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={`page-${pageNumber}-${index}`}
                  className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                  disabled={pageNumber === '...'}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button 
                key="next-page"
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
        <div key="academic-year-modal" className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-container modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <i className="fa-solid fa-calendar-alt"></i>
                <div>
                  <h2>{editingYear ? 'Edit Academic Year' : 'Create Academic Year'}</h2>
                  <p>Add or edit academic year details and terms</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AcademicYearForm
                initialData={editingYear}
                onSuccess={handleSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .badge-current {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background-color: #dcfce7;
          color: #166534;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 500;
        }
        
        .tooltip-top {
          position: relative;
        }
        
        .tooltip-top:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 5px;
          padding: 0.25rem 0.5rem;
          background-color: #1f2937;
          color: white;
          font-size: 0.75rem;
          white-space: nowrap;
          border-radius: 0.25rem;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default AcademicYearList;