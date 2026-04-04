// "use client";

// AcademicYearList.tsx

// import React, { useState } from 'react';
// import { useAcademicYears, useDeleteAcademicYear, useAuthorizeAcademicYear, useSchoolId } from './academic-year.hooks';
// import AcademicYearActions from './AcademicYearActions';
// import AcademicYearForm from './AcademicYearForm';
// import { AcademicYear } from './academic-year.types';

// const AcademicYearList: React.FC = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingYear, setEditingYear] = useState<AcademicYear | undefined>(undefined);
//   const [actionError, setActionError] = useState<string | null>(null);
//   const { data, isLoading, error, refetch } = useAcademicYears({ includeInactive: true, limit: 50 });
//   const deleteMutation = useDeleteAcademicYear();
//   const authorizeMutation = useAuthorizeAcademicYear();
//   const defaultSchoolId = useSchoolId();

//   const handleDelete = async (id: number, schoolId?: number | null) => {
//     if (window.confirm('Are you sure you want to delete this academic year?')) {
//       setActionError(null);
//       const effectiveSchoolId = schoolId ?? defaultSchoolId;
//       if (!effectiveSchoolId) {
//         setActionError('School context missing; please re-login.');
//         return;
//       }
//       try {
//         await deleteMutation.mutateAsync({ id, schoolId: effectiveSchoolId });
//         await refetch();
//       } catch (err) {
//         setActionError((err as Error).message);
//       }
//     }
//   };

//   const handleAuthorize = async (id: number, schoolId?: number | null) => {
//     if (window.confirm('Activate this academic year?')) {
//       setActionError(null);
//       const effectiveSchoolId = schoolId ?? defaultSchoolId;
//       if (!effectiveSchoolId) {
//         setActionError('School context missing; please re-login.');
//         return;
//       }
//       try {
//         await authorizeMutation.mutateAsync({ id, schoolId: effectiveSchoolId });
//         await refetch();
//       } catch (err) {
//         setActionError((err as Error).message);
//       }
//     }
//   };

//   const handleEdit = (year: AcademicYear) => {
//     setEditingYear(year);
//     setShowForm(true);
//   };

//   const handleFormSuccess = () => {
//     setShowForm(false);
//     setEditingYear(undefined);
//     refetch();
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading academic years: {(error as Error).message}</div>;

//   const academicYears = data?.items || [];

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Academic Years</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add New Academic Year
//         </button>
//       </div>

//       {showForm && (
//         <div className="mb-6 p-4 border rounded bg-gray-50">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingYear ? 'Edit Academic Year' : 'Create Academic Year'}
//           </h2>
//           <AcademicYearForm initialData={editingYear} onSuccess={handleFormSuccess} />
//           <button
//             onClick={() => {
//               setShowForm(false);
//               setEditingYear(undefined);
//             }}
//             className="mt-2 text-gray-500 hover:underline"
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//       {actionError && <div className="text-red-600 text-sm mb-2">{actionError}</div>}

//       <table className="min-w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Year Name</th>
//             <th className="border p-2">Code</th>
//             <th className="border p-2">Start Date</th>
//             <th className="border p-2">End Date</th>
//             <th className="border p-2">Current</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {academicYears.map((year, index) => (
//             <tr
//               key={
//                 year.id ?? `${year.year_code ?? 'academic-year'}-${year.year_name ?? 'row'}-${index}`
//               }
//             >
//               <td className="border p-2">{year.year_name}</td>
//               <td className="border p-2">{year.year_code}</td>
//               <td className="border p-2">
//                 {year.start_date ? new Date(year.start_date).toLocaleDateString() : '-'}
//               </td>
//               <td className="border p-2">
//                 {year.end_date ? new Date(year.end_date).toLocaleDateString() : '-'}
//               </td>
//               <td className="border p-2">{year.is_current ? 'Yes' : 'No'}</td>
//               <td className="border p-2">{year.status_name}</td>
//               <td className="border p-2">
//                 <AcademicYearActions
//                   year={year}
//                   onEdit={() => handleEdit(year)}
//                   onDelete={() => handleDelete(year.id!, year.school_id)}
//                   onAuthorize={() => handleAuthorize(year.id!, year.school_id)}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AcademicYearList;

// D:\schoolapp\frontend\src\shared\components\academic\AcademicYearList.tsx
"use client";

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
      <div className="empty-state">
        <i className="fa-solid fa-circle-exclamation"></i>
        <h3>Error Loading Data</h3>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  const academicYears = data?.items || [];

  return (
    <div className="academic-year-container">
      {/* Header */}
      <div className="page-header">
        <h1>
          <i className="fa-solid fa-calendar-alt"></i>
          Academic Years
        </h1>
        <button onClick={() => setShowForm(true)} className="add-button">
          <i className="fa-solid fa-plus"></i>
          Add New Academic Year
        </button>
      </div>

      {/* Form Modal/Card */}
      {showForm && (
        <div className="form-modal">
          <AcademicYearForm 
            initialData={editingYear} 
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingYear(undefined);
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {actionError && (
        <div className="error-message">
          <i className="fa-solid fa-circle-exclamation"></i>
          {actionError}
        </div>
      )}

      {/* Table */}
      <div className="academic-year-table-container">
        <table className="academic-year-table">
          <thead>
            <tr>
              <th><i className="fa-regular fa-tag"></i> Year Name</th>
              <th><i className="fa-regular fa-hashtag"></i> Code</th>
              <th><i className="fa-regular fa-calendar"></i> Start Date</th>
              <th><i className="fa-regular fa-calendar"></i> End Date</th>
              <th><i className="fa-solid fa-star"></i> Current</th>
              <th><i className="fa-solid fa-circle-info"></i> Status</th>
              <th><i className="fa-solid fa-gear"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            {academicYears.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <i className="fa-regular fa-folder-open"></i>
                  <h3>No Academic Years Found</h3>
                  <p>Click "Add New Academic Year" to create one.</p>
                </td>
              </tr>
            ) : (
              academicYears.map((year, index) => (
                <tr key={year.id ?? `academic-year-${index}`}>
                  <td>
                    <strong>{year.year_name || '-'}</strong>
                  </td>
                  <td>
                    <code>{year.year_code || '-'}</code>
                  </td>
                  <td>
                    {year.start_date ? new Date(year.start_date).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {year.end_date ? new Date(year.end_date).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {year.is_current ? (
                      <span className="current-badge">
                        <i className="fa-solid fa-star"></i> Current
                      </span>
                    ) : (
                      <span className="current-badge" style={{ opacity: 0.5 }}>No</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${year.status_name?.toLowerCase() || 'draft'}`}>
                      <i className={`fa-solid fa-${
                        year.status_name === 'ACTIVE' ? 'check-circle' : 
                        year.status_name === 'DRAFT' ? 'pen' : 'clock'
                      }`}></i>
                      {year.status_name || 'DRAFT'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {year.status_name === 'DRAFT' && (
                        <button
                          onClick={() => handleEdit(year)}
                          className="action-btn action-edit"
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                          Edit
                        </button>
                      )}
                      {year.status_name === 'DRAFT' && (
                        <button
                          onClick={() => handleAuthorize(year.id!, year.school_id)}
                          className="action-btn action-authorize"
                        >
                          <i className="fa-solid fa-check-circle"></i>
                          Authorize
                        </button>
                      )}
                      {year.status_name === 'DRAFT' && !year.is_current && (
                        <button
                          onClick={() => handleDelete(year.id!, year.school_id)}
                          className="action-btn action-delete"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicYearList;
