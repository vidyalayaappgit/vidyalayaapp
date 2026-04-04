// "use client";

// AcademicYearForm.tsx

// import React, { useState, useEffect } from 'react';
// import { useCreateAcademicYear, useUpdateAcademicYear, useSchoolId } from './academic-year.hooks';
// import { AcademicYear } from './academic-year.types';

// interface AcademicYearFormProps {
//   initialData?: AcademicYear;
//   onSuccess?: () => void;
// }

// const AcademicYearForm: React.FC<AcademicYearFormProps> = ({ initialData, onSuccess }) => {
//   const isEditing = !!initialData?.id;
//   const schoolId = useSchoolId();
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     yearName: initialData?.year_name || '',
//     yearCode: initialData?.year_code || '',
//     startDate: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
//     endDate: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
//     isCurrent: initialData?.is_current || false,
//   });

//   const createMutation = useCreateAcademicYear();
//   const updateMutation = useUpdateAcademicYear();

//   useEffect(() => {
//     setFormData({
//       yearName: initialData?.year_name || '',
//       yearCode: initialData?.year_code || '',
//       startDate: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
//       endDate: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
//       isCurrent: initialData?.is_current || false,
//     });
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitError(null);

//     if (!schoolId) {
//       setSubmitError('School is not set in your login context.');
//       return;
//     }

//     const payload = {
//       schoolId,
//       yearName: formData.yearName,
//       yearCode: formData.yearCode,
//       startDate: new Date(formData.startDate),
//       endDate: new Date(formData.endDate),
//       isCurrent: formData.isCurrent,
//     };

//     try {
//       if (isEditing) {
//         await updateMutation.mutateAsync({ id: initialData.id!, ...payload });
//       } else {
//         await createMutation.mutateAsync(payload);
//       }
//       onSuccess?.();
//     } catch (error) {
//       setSubmitError((error as Error).message);
//     }
//   };

  // return (
  //   <form onSubmit={handleSubmit} className="space-y-4">
  //     <div>
  //       <label className="block">Year Name</label>
  //       <input
  //         type="text"
  //         name="yearName"
  //         value={formData.yearName}
  //         onChange={handleChange}
  //         required
  //         className="border p-2 w-full"
  //       />
  //     </div>
  //     <div>
  //       <label className="block">Year Code (4 digits)</label>
  //       <input
  //         type="text"
  //         name="yearCode"
  //         value={formData.yearCode}
  //         onChange={handleChange}
  //         maxLength={4}
  //         required
  //         className="border p-2 w-full"
  //       />
  //     </div>
  //     <div>
  //       <label className="block">Start Date</label>
  //       <input
  //         type="date"
  //         name="startDate"
  //         value={formData.startDate}
  //         onChange={handleChange}
  //         required
  //         className="border p-2 w-full"
  //       />
  //     </div>
  //     <div>
  //       <label className="block">End Date</label>
  //       <input
  //         type="date"
  //         name="endDate"
  //         value={formData.endDate}
  //         onChange={handleChange}
  //         required
  //         className="border p-2 w-full"
  //       />
  //     </div>
  //     {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
  //     <div>
  //       <label className="inline-flex items-center">
  //         <input
  //           type="checkbox"
  //           name="isCurrent"
  //           checked={formData.isCurrent}
  //           onChange={handleChange}
  //           className="mr-2"
  //         />
  //         Set as current academic year
  //       </label>
  //     </div>
  //     <button
  //       type="submit"
  //       disabled={createMutation.isPending || updateMutation.isPending}
  //       className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
  //     >
  //       {isEditing ? 'Update' : 'Create'} Academic Year
  //     </button>
  //   </form>
  // );
//   return (
//   <div className="page-container">
//     <div className="card">
//       <div className="card-header">
//         <h2>{isEditing ? "Edit Academic Year" : "Create Academic Year"}</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="form-grid">

//         {/* Row 1 */}
//         <div className="form-group">
//           <label>Year Name</label>
//           <input
//             type="text"
//             name="yearName"
//             value={formData.yearName}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Year Code (4 digits)</label>
//           <input
//             type="text"
//             name="yearCode"
//             value={formData.yearCode}
//             onChange={handleChange}
//             maxLength={4}
//             required
//           />
//         </div>

//         {/* Row 2 */}
//         <div className="form-group">
//           <label>Start Date</label>
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>End Date</label>
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             required
//           />ā
//         </div>

//         {/* Row 3 */}
//         <div className="form-group full-width">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               name="isCurrent"
//               checked={formData.isCurrent}
//               onChange={handleChange}
//             />
//             Set as current academic year
//           </label>
//         </div>

//         {submitError && (
//           <div className="form-error full-width">{submitError}</div>
//         )}

//         {/* Buttons */}
//         <div className="form-actions full-width">
//           <button
//             type="submit"
//             disabled={createMutation.isPending || updateMutation.isPending}
//             className="btn-primary"
//           >
//             {isEditing ? "Update" : "Create"}
//           </button>

//           <button type="button" className="btn-secondary">
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// );
// };


// export default AcademicYearForm;


// D:\schoolapp\frontend\src\shared\components\academic\AcademicYearForm.tsx
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
    yearName: initialData?.year_name || '',
    yearCode: initialData?.year_code || '',
    startDate: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
    endDate: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
    isCurrent: initialData?.is_current || false,
  });

  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    if (initialData) {
      setFormData({
        yearName: initialData.year_name || '',
        yearCode: initialData.year_code || '',
        startDate: initialData.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '',
        endDate: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
        isCurrent: initialData.is_current || false,
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

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setSubmitError('End date must be after start date');
      return;
    }

    const payload = {
      schoolId,
      yearName: formData.yearName.trim(),
      yearCode: formData.yearCode.trim(),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isCurrent: formData.isCurrent,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };

  return (
    <div className="academic-year-form-wrapper">
      <div className="modern-card">
        {/* Card Header */}
        <div className="card-header">
          <div className="card-title-section">
            <i className="fa-solid fa-calendar-alt"></i>
            <div>
              <h2>{isEditing ? "Edit Academic Year" : "Create Academic Year"}</h2>
              <p>Add a new academic year to the system</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modern-form">
          {/* 2-Column Grid */}
          <div className="form-two-columns">
            {/* Year Name */}
            <div className="input-group">
              <label>
                <i className="fa-regular fa-tag"></i>
                Year Name
              </label>
              <input
                type="text"
                name="yearName"
                value={formData.yearName}
                onChange={handleChange}
                placeholder="e.g., Academic Year 2024-2025"
                required
              />
              <small>Enter a descriptive name for this academic year</small>
            </div>

            {/* Year Code */}
            <div className="input-group">
              <label>
                <i className="fa-regular fa-hashtag"></i>
                Year Code
              </label>
              <input
                type="text"
                name="yearCode"
                value={formData.yearCode}
                onChange={handleChange}
                placeholder="e.g., 2024-25"
                maxLength={10}
                required
              />
              <small>Short code for reference</small>
            </div>

            {/* Start Date */}
            <div className="input-group">
              <label>
                <i className="fa-regular fa-calendar-plus"></i>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <small>When does the academic year begin?</small>
            </div>

            {/* End Date */}
            <div className="input-group">
              <label>
                <i className="fa-regular fa-calendar-minus"></i>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <small>When does the academic year end?</small>
            </div>
          </div>

          {/* Date Range Preview */}
          {formData.startDate && formData.endDate && (
            <div className="date-preview">
              <i className="fa-regular fa-calendar-range"></i>
              <span>
                Selected: <strong>{new Date(formData.startDate).toLocaleDateString()}</strong>
                {" → "}
                <strong>{new Date(formData.endDate).toLocaleDateString()}</strong>
              </span>
            </div>
          )}

          {/* Checkbox */}
          <div className="checkbox-section">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span className="checkbox-text">
                <i className="fa-solid fa-star"></i>
                Set as current academic year
              </span>
            </label>
            <p className="checkbox-hint">
              Current academic year will be used as default across the system
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="error-message">
              <i className="fa-solid fa-circle-exclamation"></i>
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              <i className="fa-regular fa-times"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
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
      </div>
    </div>
  );
};

export default AcademicYearForm;