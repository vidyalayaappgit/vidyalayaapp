"use client";

// AcademicYearList.tsx

import React, { useState } from 'react';
import { useAcademicYears, useDeleteAcademicYear, useAuthorizeAcademicYear, useSchoolId } from './academic-year.hooks';
import AcademicYearActions from './AcademicYearActions';
import AcademicYearForm from './AcademicYearForm';
import { AcademicYear } from './academic-year.types';

const AcademicYearList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | undefined>(undefined);
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useAcademicYears({ includeInactive: true, limit: 50 });
  const deleteMutation = useDeleteAcademicYear();
  const authorizeMutation = useAuthorizeAcademicYear();
  const defaultSchoolId = useSchoolId();

  const handleDelete = async (id: number, schoolId?: number | null) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      setActionError(null);
      const effectiveSchoolId = schoolId ?? defaultSchoolId;
      if (!effectiveSchoolId) {
        setActionError('School context missing; please re-login.');
        return;
      }
      try {
        await deleteMutation.mutateAsync({ id, schoolId: effectiveSchoolId });
        await refetch();
      } catch (err) {
        setActionError((err as Error).message);
      }
    }
  };

  const handleAuthorize = async (id: number, schoolId?: number | null) => {
    if (window.confirm('Activate this academic year?')) {
      setActionError(null);
      const effectiveSchoolId = schoolId ?? defaultSchoolId;
      if (!effectiveSchoolId) {
        setActionError('School context missing; please re-login.');
        return;
      }
      try {
        await authorizeMutation.mutateAsync({ id, schoolId: effectiveSchoolId });
        await refetch();
      } catch (err) {
        setActionError((err as Error).message);
      }
    }
  };

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingYear(undefined);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading academic years: {(error as Error).message}</div>;

  const academicYears = data?.items || [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Academic Years</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Academic Year
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingYear ? 'Edit Academic Year' : 'Create Academic Year'}
          </h2>
          <AcademicYearForm initialData={editingYear} onSuccess={handleFormSuccess} />
          <button
            onClick={() => {
              setShowForm(false);
              setEditingYear(undefined);
            }}
            className="mt-2 text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
      {actionError && <div className="text-red-600 text-sm mb-2">{actionError}</div>}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Year Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Current</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {academicYears.map((year, index) => (
            <tr
              key={
                year.id ?? `${year.year_code ?? 'academic-year'}-${year.year_name ?? 'row'}-${index}`
              }
            >
              <td className="border p-2">{year.year_name}</td>
              <td className="border p-2">{year.year_code}</td>
              <td className="border p-2">
                {year.start_date ? new Date(year.start_date).toLocaleDateString() : '-'}
              </td>
              <td className="border p-2">
                {year.end_date ? new Date(year.end_date).toLocaleDateString() : '-'}
              </td>
              <td className="border p-2">{year.is_current ? 'Yes' : 'No'}</td>
              <td className="border p-2">{year.status_name}</td>
              <td className="border p-2">
                <AcademicYearActions
                  year={year}
                  onEdit={() => handleEdit(year)}
                  onDelete={() => handleDelete(year.id!, year.school_id)}
                  onAuthorize={() => handleAuthorize(year.id!, year.school_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearList;
