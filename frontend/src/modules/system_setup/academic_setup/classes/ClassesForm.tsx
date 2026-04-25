"use client";

import React, { useState, useEffect } from 'react';
import { useCreateClass, useUpdateClass, useSchoolId } from './classes.hooks';
import { Class, Section } from './classes.types';

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

interface ClassFormProps {
  initialData?: Class;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel 
}) => {
  const isEditing = !!initialData?.id;
  const schoolId = useSchoolId();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    className: initialData?.className || initialData?.class_name || '',
    classCode: initialData?.classCode || initialData?.class_code || '',
    classNumber: initialData?.classNumber?.toString() || initialData?.class_number?.toString() || '',
    academicLevelId: '',
    classRomanNumeral: initialData?.classRomanNumeral || '',
    displayOrder: initialData?.displayOrder?.toString() || '',
    minAgeRequired: initialData?.minAgeRequired?.toString() || '',
    maxAgeRequired: initialData?.maxAgeRequired?.toString() || '',
    description: initialData?.description || '',
  });

  const [sections, setSections] = useState<Partial<Section>[]>(
    initialData?.sections?.map(s => ({
      id: s.id,
      section_code: s.section_code,
      section_name: s.section_name,
      room_id: s.room_id,
      capacity: s.capacity || 30,
      start_time: s.start_time,
      end_time: s.end_time,
      display_order: s.display_order,
      description: s.description,
    })) || []
  );

  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();

  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className || initialData.class_name || '',
        classCode: initialData.classCode || initialData.class_code || '',
        classNumber: initialData.classNumber?.toString() || initialData.class_number?.toString() || '',
        academicLevelId: '',
        classRomanNumeral: initialData.classRomanNumeral || '',
        displayOrder: initialData.displayOrder?.toString() || '',
        minAgeRequired: initialData.minAgeRequired?.toString() || '',
        maxAgeRequired: initialData.maxAgeRequired?.toString() || '',
        description: initialData.description || '',
      });
      setSections(
        initialData.sections?.map(s => ({
          id: s.id,
          section_code: s.section_code,
          section_name: s.section_name,
          room_id: s.room_id,
          capacity: s.capacity || 30,
          start_time: s.start_time,
          end_time: s.end_time,
          display_order: s.display_order,
          description: s.description,
        })) || []
      );
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        section_code: '',
        section_name: '',
        capacity: 30,
        display_order: sections.length + 1,
      }
    ]);
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    updatedSections.forEach((section, idx) => {
      section.display_order = idx + 1;
    });
    setSections(updatedSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!schoolId) {
      setSubmitError('School context not found. Please login again.');
      return;
    }

    if (!formData.className.trim()) {
      setSubmitError('Class name is required');
      return;
    }

    if (!formData.classCode.trim()) {
      setSubmitError('Class code is required');
      return;
    }

    if (!formData.classNumber) {
      setSubmitError('Class number is required');
      return;
    }

    const classNumber = parseInt(formData.classNumber);
    if (isNaN(classNumber) || classNumber < 0 || classNumber > 14) {
      setSubmitError('Class number must be between 0 and 14');
      return;
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section.section_code?.trim()) {
        setSubmitError(`Section ${i + 1}: Section code is required`);
        return;
      }
      if (!section.section_name?.trim()) {
        setSubmitError(`Section ${i + 1}: Section name is required`);
        return;
      }
      if (section.capacity && (section.capacity < 1 || section.capacity > 200)) {
        setSubmitError(`Section ${i + 1}: Capacity must be between 1 and 200`);
        return;
      }
    }

    try {
      if (isEditing && initialData?.id) {
        const updateSections: Section[] = sections.map(s => ({
          id: s.id,
          section_code: s.section_code!,
          section_name: s.section_name!,
          room_id: s.room_id,
          capacity: s.capacity || 30,
          start_time: s.start_time,
          end_time: s.end_time,
          display_order: s.display_order,
          description: s.description,
        }));

        const originalSectionIds = initialData.sections?.map(s => s.id).filter(id => id !== undefined) || [];
        const currentSectionIds = sections.map(s => s.id).filter(id => id !== undefined);
        const sectionsToDelete = originalSectionIds.filter(id => !currentSectionIds.includes(id));

        await updateMutation.mutateAsync({
          id: initialData.id,
          schoolId,
          className: formData.className.trim(),
          classRomanNumeral: formData.classRomanNumeral || undefined,
          displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : undefined,
          minAgeRequired: formData.minAgeRequired ? parseInt(formData.minAgeRequired) : undefined,
          maxAgeRequired: formData.maxAgeRequired ? parseInt(formData.maxAgeRequired) : undefined,
          description: formData.description || undefined,
          sections: updateSections,
          sectionsToDelete: sectionsToDelete.length > 0 ? sectionsToDelete : undefined,
        });
      } else {
        const createSections: Omit<Section, 'id'>[] = sections.map(s => ({
          section_code: s.section_code!,
          section_name: s.section_name!,
          room_id: s.room_id,
          capacity: s.capacity || 30,
          start_time: s.start_time,
          end_time: s.end_time,
          display_order: s.display_order,
          description: s.description,
        }));

        await createMutation.mutateAsync({
          schoolId,
          classCode: formData.classCode.trim(),
          className: formData.className.trim(),
          classNumber: classNumber,
          academicLevelId: parseInt(formData.academicLevelId) || 1,
          classRomanNumeral: formData.classRomanNumeral || undefined,
          displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : undefined,
          minAgeRequired: formData.minAgeRequired ? parseInt(formData.minAgeRequired) : undefined,
          maxAgeRequired: formData.maxAgeRequired ? parseInt(formData.maxAgeRequired) : undefined,
          description: formData.description || undefined,
          sections: createSections,
        });
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
          {/* Class Name */}
          <div className="form-group">
            <label>Class Name <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-tag"></i>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g., Class 1"
                required
              />
            </div>
          </div>

          {/* Class Code */}
          <div className="form-group">
            <label>Class Code <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-hashtag"></i>
              <input
                type="text"
                name="classCode"
                value={formData.classCode}
                onChange={handleChange}
                placeholder="e.g., CLS-01"
                required
              />
            </div>
            <div className="form-help">
              <i className="fa-regular fa-circle-info"></i>
              Unique identifier for this class
            </div>
          </div>

          {/* Class Number */}
          <div className="form-group">
            <label>Class Number <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-number"></i>
              <input
                type="number"
                name="classNumber"
                value={formData.classNumber}
                onChange={handleChange}
                placeholder="0=Nursery, 1=LKG, 2=UKG, 3=Class 1..."
                min="0"
                max="14"
                required
              />
            </div>
            <div className="form-help">
              <i className="fa-regular fa-circle-info"></i>
              0=Nursery, 1=LKG, 2=UKG, 3-14=Class 1-12
            </div>
          </div>

          {/* Roman Numeral */}
          <div className="form-group">
            <label>Roman Numeral</label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-chart-line"></i>
              <input
                type="text"
                name="classRomanNumeral"
                value={formData.classRomanNumeral}
                onChange={handleChange}
                placeholder="e.g., I, II, III..."
              />
            </div>
            <div className="form-help">
              <i className="fa-regular fa-circle-info"></i>
              Optional - for classes 1-12 only
            </div>
          </div>

          {/* Display Order */}
          <div className="form-group">
            <label>Display Order</label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-arrow-down-1-9"></i>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="For custom ordering"
                min="0"
              />
            </div>
            <div className="form-help">
              <i className="fa-regular fa-circle-info"></i>
              For custom ordering
            </div>
          </div>

          {/* Academic Level */}
          <div className="form-group">
            <label>Academic Level <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-graduation-cap"></i>
              <select
                name="academicLevelId"
                value={formData.academicLevelId}
                onChange={handleChange}
                required
              >
                <option value="">Select Academic Level</option>
                <option value="1">Pre-Primary</option>
                <option value="2">Lower Primary</option>
                <option value="3">Upper Primary</option>
                <option value="4">Secondary</option>
                <option value="5">Higher Secondary</option>
              </select>
            </div>
          </div>

          {/* Minimum Age */}
          <div className="form-group">
            <label>Minimum Age (Years)</label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-calendar"></i>
              <input
                type="number"
                name="minAgeRequired"
                value={formData.minAgeRequired}
                onChange={handleChange}
                placeholder="e.g., 6"
                min="0"
              />
            </div>
          </div>

          {/* Maximum Age */}
          <div className="form-group">
            <label>Maximum Age (Years)</label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-calendar"></i>
              <input
                type="number"
                name="maxAgeRequired"
                value={formData.maxAgeRequired}
                onChange={handleChange}
                placeholder="e.g., 7"
                min="0"
              />
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <div className="input-icon-wrapper">
              <i className="fa-regular fa-align-left"></i>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional information about this class"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Sections Section */}
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                <i className="fa-solid fa-layer-group" style={{ marginRight: '0.5rem' }}></i>
                Sections
              </h3>
              <small style={{ color: 'var(--text-secondary)' }}>Define sections within this class</small>
            </div>
            <button type="button" className="btn btn-sm btn-outline" onClick={addSection}>
              <i className="fa-solid fa-plus"></i> Add Section
            </button>
          </div>

          {sections.length > 0 && (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Section Name</th>
                    <th>Section Code</th>
                    <th>Capacity</th>
                    <th>Room ID</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((section, index) => (
                    <tr key={index}>
                      <td>{section.display_order || index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={section.section_name || ''}
                          onChange={(e) => updateSection(index, 'section_name', e.target.value)}
                          placeholder="e.g., Section A"
                          className="form-control"
                          style={{ width: '100%', minWidth: '120px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={section.section_code || ''}
                          onChange={(e) => updateSection(index, 'section_code', e.target.value.toUpperCase())}
                          placeholder="e.g., A"
                          className="form-control"
                          style={{ width: '100px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={section.capacity || 30}
                          onChange={(e) => updateSection(index, 'capacity', parseInt(e.target.value) || 30)}
                          placeholder="30"
                          className="form-control"
                          style={{ width: '100px' }}
                          min="1"
                          max="200"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={section.room_id || ''}
                          onChange={(e) => updateSection(index, 'room_id', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="Room ID"
                          className="form-control"
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn icon-btn--delete"
                          onClick={() => removeSection(index)}
                          data-tooltip="Remove Section"
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

          {sections.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <i className="fa-regular fa-layer-group" style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}></i>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No sections defined. Click "Add Section" to create sections.</p>
            </div>
          )}
        </div>

        <div className="info-note" style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <i className="fa-solid fa-info-circle" style={{ color: '#0284c7' }}></i>
          <small style={{ color: '#0369a1' }}>
            Classes are created in DRAFT status. After creation, you can activate or authorize them to make them available for use.
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
              {isEditing ? "Update Class" : "Create Class"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;