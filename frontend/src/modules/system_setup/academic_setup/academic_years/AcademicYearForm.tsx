"use client";

// AcademicYearForm.tsx

import React, { useState, useEffect } from 'react';
import { useCreateAcademicYear, useUpdateAcademicYear, useSchoolId } from './academic-year.hooks';
import { AcademicYear } from './academic-year.types';

interface AcademicYearFormProps {
  initialData?: AcademicYear;
  onSuccess?: () => void;
}

const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ initialData, onSuccess }) => {
  const isEditing = !!initialData?.id;
  const schoolId = useSchoolId();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    yearName: initialData?.year_name || '',
    yearCode: initialData?.year_code || '',
    startDate: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
    endDate: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
    isCurrent: initialData?.is_current || false,
  });

  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    setFormData({
      yearName: initialData?.year_name || '',
      yearCode: initialData?.year_code || '',
      startDate: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
      endDate: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
      isCurrent: initialData?.is_current || false,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setSubmitError('School is not set in your login context.');
      return;
    }

    const payload = {
      schoolId,
      yearName: formData.yearName,
      yearCode: formData.yearCode,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isCurrent: formData.isCurrent,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id!, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Year Name</label>
        <input
          type="text"
          name="yearName"
          value={formData.yearName}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Year Code (4 digits)</label>
        <input
          type="text"
          name="yearCode"
          value={formData.yearCode}
          onChange={handleChange}
          maxLength={4}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="isCurrent"
            checked={formData.isCurrent}
            onChange={handleChange}
            className="mr-2"
          />
          Set as current academic year
        </label>
      </div>
      <button
        type="submit"
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isEditing ? 'Update' : 'Create'} Academic Year
      </button>
    </form>
  );
};

export default AcademicYearForm;

