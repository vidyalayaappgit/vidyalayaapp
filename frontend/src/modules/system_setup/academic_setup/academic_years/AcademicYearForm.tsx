"use client";

import React, { useState, useEffect } from 'react';
import { useCreateAcademicYear, useUpdateAcademicYear, useSchoolId } from './academic-year.hooks';
import { AcademicYear, AcademicTerm } from './academic-year.types';

interface AcademicYearFormProps {
  initialData?: AcademicYear;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel 
}) => {
  const isEditing = !!initialData?.id;
  const schoolId = useSchoolId();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    try {
      // Parse the date string and create a date object without timezone issues
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Get year, month, day in local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    yearName: initialData?.yearName || '',
    yearCode: initialData?.yearCode || '',
    startDate: formatDateForInput(initialData?.startDate),
    endDate: formatDateForInput(initialData?.endDate),
  });

  const [terms, setTerms] = useState<Omit<AcademicTerm, 'id'>[]>(() => {
    if (!initialData?.terms || initialData.terms.length === 0) return [];
    
    return initialData.terms.map(term => ({
      term_name: term.term_name,
      term_code: term.term_code,
      term_order: term.term_order,
      start_date: formatDateForInput(term.start_date),
      end_date: formatDateForInput(term.end_date),
    }));
  });

  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    if (initialData) {
      setFormData({
        yearName: initialData.yearName || '',
        yearCode: initialData.yearCode || '',
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
      });
      
      setTerms(
        initialData.terms?.map(term => ({
          term_name: term.term_name,
          term_code: term.term_code,
          term_order: term.term_order,
          start_date: formatDateForInput(term.start_date),
          end_date: formatDateForInput(term.end_date),
        })) || []
      );
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Terms management functions
  const addTerm = () => {
    const newOrder = terms.length + 1;
    setTerms([
      ...terms,
      {
        term_name: '',
        term_code: `TERM${newOrder}`,
        term_order: newOrder,
        start_date: '',
        end_date: '',
      }
    ]);
  };

  const updateTerm = (index: number, field: keyof Omit<AcademicTerm, 'id'>, value: string | number) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = { ...updatedTerms[index], [field]: value };
    
    // If updating term_order, reorder all terms
    if (field === 'term_order') {
      updatedTerms.sort((a, b) => (a.term_order || 0) - (b.term_order || 0));
    }
    
    setTerms(updatedTerms);
  };

  const removeTerm = (index: number) => {
    const updatedTerms = terms.filter((_, i) => i !== index);
    // Reorder remaining terms
    updatedTerms.forEach((term, idx) => {
      term.term_order = idx + 1;
      term.term_code = `TERM${idx + 1}`;
    });
    setTerms(updatedTerms);
  };

  const validateTerms = (): string | null => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      
      if (!term.term_name.trim()) {
        return `Term ${i + 1}: Name is required`;
      }
      
      if (!term.start_date) {
        return `Term ${i + 1}: Start date is required`;
      }
      
      if (!term.end_date) {
        return `Term ${i + 1}: End date is required`;
      }
      
      const termStart = new Date(term.start_date);
      const termEnd = new Date(term.end_date);
      
      if (termStart >= termEnd) {
        return `Term ${i + 1}: End date must be after start date`;
      }
      
      if (termStart < startDate || termEnd > endDate) {
        return `Term ${i + 1}: Dates must be within the academic year range`;
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!schoolId) {
      setSubmitError('School context not found. Please login again.');
      return;
    }

    if (!formData.yearName.trim()) {
      setSubmitError('Year name is required');
      return;
    }

    if (!formData.yearCode.trim()) {
      setSubmitError('Year code is required');
      return;
    }

    if (!formData.startDate) {
      setSubmitError('Start date is required');
      return;
    }

    if (!formData.endDate) {
      setSubmitError('End date is required');
      return;
    }

    const startDateObj = new Date(formData.startDate);
    const endDateObj = new Date(formData.endDate);

    if (startDateObj >= endDateObj) {
      setSubmitError('End date must be after start date');
      return;
    }

    // Validate terms
    const termError = validateTerms();
    if (termError) {
      setSubmitError(termError);
      return;
    }

    const payload = {
      schoolId,
      yearName: formData.yearName.trim(),
      yearCode: formData.yearCode.trim(),
      startDate: startDateObj,
      endDate: endDateObj,
      terms: terms.length > 0 ? terms : undefined,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-body" style={{ padding: 0 }}>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Year Name <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-tag"></i>
              <input
                type="text"
                name="yearName"
                value={formData.yearName}
                onChange={handleChange}
                placeholder="e.g., Academic Year 2024-2025"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Year Code <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-hashtag"></i>
              <input
                type="text"
                name="yearCode"
                value={formData.yearCode}
                onChange={handleChange}
                placeholder="e.g., 2425"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Start Date <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-calendar-plus"></i>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Date <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-calendar-minus"></i>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Terms Section */}
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                <i className="fa-solid fa-layer-group" style={{ marginRight: '0.5rem' }}></i>
                Academic Terms
              </h3>
              <small style={{ color: 'var(--text-secondary)' }}>Define terms within this academic year</small>
            </div>
            <button type="button" className="btn btn-sm btn-outline" onClick={addTerm}>
              <i className="fa-solid fa-plus"></i> Add Term
            </button>
          </div>

          {terms.length > 0 && (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Term Name</th>
                    <th>Term Code</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((term, index) => (
                    <tr key={index}>
                      <td>{term.term_order}</td>
                      <td>
                        <input
                          type="text"
                          value={term.term_name}
                          onChange={(e) => updateTerm(index, 'term_name', e.target.value)}
                          placeholder="e.g., Mid Term"
                          className="form-control"
                          style={{ width: '100%', minWidth: '120px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={term.term_code}
                          onChange={(e) => updateTerm(index, 'term_code', e.target.value.toUpperCase())}
                          placeholder="e.g., TERM1"
                          className="form-control"
                          style={{ width: '100px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={term.start_date}
                          onChange={(e) => updateTerm(index, 'start_date', e.target.value)}
                          className="form-control"
                          style={{ width: '140px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={term.end_date}
                          onChange={(e) => updateTerm(index, 'end_date', e.target.value)}
                          className="form-control"
                          style={{ width: '140px' }}
                          required
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn icon-btn--delete"
                          onClick={() => removeTerm(index)}
                          data-tooltip="Remove Term"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {terms.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <i className="fa-regular fa-calendar" style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}></i>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No terms defined. Click "Add Term" to create terms.</p>
            </div>
          )}
        </div>

        <div className="info-note" style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <i className="fa-solid fa-info-circle" style={{ color: '#0284c7' }}></i>
          <small style={{ color: '#0369a1' }}>
            Academic years are created in DRAFT status. After creation, you can activate it to make it the current academic year. Terms help organize the academic year into smaller periods.
          </small>
        </div>

        {submitError && (
          <div className="form-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {submitError}
          </div>
        )}
      </div>

      <div className="form-footer" style={{ paddingTop: 'var(--spacing-4)', marginTop: 0 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="fa-regular fa-times"></i> Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {(createMutation.isPending || updateMutation.isPending) ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              <i className="fa-regular fa-floppy-disk"></i>
              {isEditing ? "Update Academic Year" : "Create Academic Year"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AcademicYearForm;