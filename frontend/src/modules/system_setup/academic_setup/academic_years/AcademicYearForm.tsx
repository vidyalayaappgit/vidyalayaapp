"use client";

import React, { useState, useEffect } from 'react';
import { useCreateAcademicYear, useUpdateAcademicYear, useSchoolId } from './academic-year.hooks';
import { AcademicYear } from './academic-year.types';

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

  const [formData, setFormData] = useState({
    yearName: initialData?.yearName || '',
    yearCode: initialData?.yearCode || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : '',
    isCurrent: initialData?.isCurrent || false,
  });

  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    if (initialData) {
      setFormData({
        yearName: initialData.yearName || '',
        yearCode: initialData.yearCode || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : '',
        isCurrent: initialData.isCurrent || false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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

    const payload = {
      schoolId,
      yearName: formData.yearName.trim(),
      yearCode: formData.yearCode.trim(),
      startDate: startDateObj,
      endDate: endDateObj,
      isCurrent: formData.isCurrent,
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
          {/* Year Name */}
          <div className="form-group">
            <label>
              Year Name <span className="required">*</span>
            </label>
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

          {/* Year Code */}
          <div className="form-group">
            <label>
              Year Code <span className="required">*</span>
            </label>
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

          {/* Start Date */}
          <div className="form-group">
            <label>
              Start Date <span className="required">*</span>
            </label>
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

          {/* End Date */}
          <div className="form-group">
            <label>
              End Date <span className="required">*</span>
            </label>
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

        {/* Checkbox for Current Year */}
        <div className="toggle-group">
          <div className="toggle-label">
            <span>
              <i className="fa-solid fa-star"></i>
              Set as current academic year
            </span>
            <small>Current academic year will be used as default across the system</small>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="form-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {submitError}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-footer" style={{ paddingTop: 'var(--spacing-4)', marginTop: 0 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="fa-regular fa-times"></i>
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {(createMutation.isPending || updateMutation.isPending) ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Processing...
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