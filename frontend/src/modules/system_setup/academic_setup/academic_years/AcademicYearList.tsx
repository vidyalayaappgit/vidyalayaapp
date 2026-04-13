"use client";

import React, { useState, useEffect } from 'react';
import {
  useAcademicYears,
  useDeleteAcademicYear,
  useAuthorizeAcademicYear,
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
  const authorizeMutation = useAuthorizeAcademicYear();

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
    if (!confirm('Are you sure you want to delete this academic year?')) return;

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

  const handleAuthorize = async (id: number, schoolIdVal?: number | null) => {
    if (!confirm('Activate this academic year?')) return;

    try {
      await authorizeMutation.mutateAsync({
        id,
        schoolId: schoolIdVal ?? schoolId!
      });
      setSuccessMsg('Academic year authorized successfully');
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
            <p>Manage school academic years and sessions</p>
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
                <th>Current</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty-state">
                    <div className="empty-state">
                      <i className="fa-regular fa-folder-open"></i>
                      <h4>No Academic Years Found</h4>
                      <p>Click "Add New Academic Year" to create one.</p>
                    </div>
                   </td>
                 </tr>
              ) : (
                currentItems.map((row) => {
                  const dbStatus = (row.status || '').toUpperCase();
                  const isFresh = dbStatus === 'FRESH';
                  const isAuthorised = dbStatus === 'AUTHORISED';
                  const displayStatus = isFresh ? 'DRAFT' : isAuthorised ? 'ACTIVE' : dbStatus;
                  
                  return (
                    <tr key={row.id}>
                      <td data-label="Year Name">
                        <strong>{row.yearName || '-'}</strong>
                      </td>
                      <td data-label="Year Code">
                        <code>{row.yearCode || '-'}</code>
                      </td>
                      <td data-label="Start Date">
                        {row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'}
                      </td>
                      <td data-label="End Date">
                        {row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}
                      </td>
                      <td data-label="Current">
                        {row.isCurrent ? (
                          <span className="badge badge-success">
                            <i className="fa-solid fa-star"></i> Current
                          </span>
                        ) : (
                          <span className="badge badge-neutral">No</span>
                        )}
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${isAuthorised ? 'badge-success' : 'badge-warning'}`}>
                          <i className={`fa-solid fa-${isAuthorised ? 'check-circle' : 'pen'}`}></i>
                          {displayStatus}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          {/* EDIT Button - With Tooltip */}
                          {isFresh ? (
                            <button
                              className="icon-btn icon-btn--edit tooltip-top"
                              onClick={() => handleEdit(row)}
                              data-tooltip="Edit Academic Year"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          ) : (
                            <button
                              className="icon-btn icon-btn--edit disabled tooltip-top"
                              disabled
                              data-tooltip="Cannot edit authorized academic year"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          )}
                          
                          {/* AUTHORIZE Button - With Tooltip */}
                          {isFresh ? (
                            <button
                              className="icon-btn icon-btn--authorize tooltip-top"
                              onClick={() => handleAuthorize(row.id!, row.schoolId)}
                              data-tooltip="Authorize Academic Year"
                            >
                              <i className="fa-solid fa-check-circle"></i>
                            </button>
                          ) : (
                            <button
                              className="icon-btn icon-btn--authorize disabled tooltip-top"
                              disabled
                              data-tooltip="Already authorized"
                            >
                              <i className="fa-solid fa-check-circle"></i>
                            </button>
                          )}
                          
                          {/* DELETE Button - With Tooltip */}
                          {isFresh && !row.isCurrent ? (
                            <button
                              className="icon-btn icon-btn--delete tooltip-top"
                              onClick={() => handleDelete(row.id!, row.schoolId)}
                              data-tooltip="Delete Academic Year"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          ) : isAuthorised && (
                            <button
                              className="icon-btn icon-btn--delete disabled tooltip-top"
                              disabled
                              data-tooltip="Cannot delete authorized academic year"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          )}
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
                <i className="fa-solid fa-calendar-alt"></i>
                <div>
                  <h2>{editingYear ? 'Edit Academic Year' : 'Create Academic Year'}</h2>
                  <p>Add a new academic year to the system</p>
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
    </div>
  );
};

export default AcademicYearList;