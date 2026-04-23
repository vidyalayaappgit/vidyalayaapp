// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\ClassesForm.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useCreateClass, useUpdateClass, useSchoolId } from './classes.hooks';
import { Class, Section } from './classes.types';
import '@/styles/components/classes.css';
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

  const handleSectionChange = (index: number, field: keyof Section, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
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
    <form onSubmit={handleSubmit} className="class-form-container">
      <div className="class-form-body">
        {/* Class Information Section */}
        <div className="class-form-section">
          <div className="class-form-section-header">
            <i className="fa-solid fa-info-circle"></i>
            <span>Class Information</span>
          </div>
          <div className="class-form-section-body">
            <div className="class-form-grid-2">
              <div className="class-form-group">
                <label>Class Name <span className="required">*</span></label>
                <div className="class-input-icon-wrapper">
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

              <div className="class-form-group">
                <label>Class Code <span className="required">*</span></label>
                <div className="class-input-icon-wrapper">
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
                <div className="class-form-help">
                  <i className="fa-regular fa-circle-info"></i>
                  Unique identifier for this class
                </div>
              </div>

              <div className="class-form-group">
                <label>Class Number <span className="required">*</span></label>
                <div className="class-input-icon-wrapper">
                  <i className="fa-regular fa-number"></i>
                  <input
                    type="number"
                    name="classNumber"
                    value={formData.classNumber}
                    onChange={handleChange}
                    placeholder="0=Nursery,1=LKG,2=UKG,3=Class1..."
                    min="0"
                    max="14"
                    required
                  />
                </div>
                <div className="class-form-help">
                  <i className="fa-regular fa-circle-info"></i>
                  0=Nursery, 1=LKG, 2=UKG, 3-14=Class 1-12
                </div>
              </div>

              <div className="class-form-group">
                <label>Roman Numeral</label>
                <div className="class-input-icon-wrapper">
                  <i className="fa-regular fa-chart-line"></i>
                  <input
                    type="text"
                    name="classRomanNumeral"
                    value={formData.classRomanNumeral}
                    onChange={handleChange}
                    placeholder="e.g., I, II, III..."
                  />
                </div>
                <div className="class-form-help">
                  <i className="fa-regular fa-circle-info"></i>
                  Optional - for classes 1-12 only
                </div>
              </div>

              <div className="class-form-group">
                <label>Display Order</label>
                <div className="class-input-icon-wrapper">
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
              </div>

              <div className="class-form-group">
                <label>Academic Level <span className="required">*</span></label>
                <div className="class-input-icon-wrapper">
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

              <div className="class-form-group">
                <label>Minimum Age (Years)</label>
                <div className="class-input-icon-wrapper">
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

              <div className="class-form-group">
                <label>Maximum Age (Years)</label>
                <div className="class-input-icon-wrapper">
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

              <div className="class-form-group class-form-grid-full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional information about this class"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections Section - Compact Cards */}
        <div className="class-form-section">
          <div className="class-form-section-header">
            <i className="fa-solid fa-layer-group"></i>
            <span>Sections</span>
            <button type="button" className="class-add-section-btn" onClick={addSection}>
              <i className="fa-solid fa-plus"></i> Add Section
            </button>
          </div>
          <div className="class-form-section-body class-sections-scrollable">
            {sections.length === 0 ? (
              <div className="class-empty-state">
                <i className="fa-regular fa-folder-open"></i>
                <p>No sections added yet. Click "Add Section" to create one.</p>
              </div>
            ) : (
              <div className="class-sections-compact-list">
                {sections.map((section, index) => (
                  <div key={index} className="class-section-compact-card">
                    <div className="class-section-compact-header">
                      <div className="class-section-compact-title">
                        <i className="fa-solid fa-layer-group"></i>
                        <span>Section {String.fromCharCode(65 + index)}</span>
                      </div>
                      <button
                        type="button"
                        className="class-remove-section-btn"
                        onClick={() => removeSection(index)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                    <div className="class-section-compact-body">
                      <div className="class-form-grid-2">
                        <div className="class-form-group">
                          <label>Section Code <span className="required">*</span></label>
                          <input
                            type="text"
                            value={section.section_code || ''}
                            onChange={(e) => handleSectionChange(index, 'section_code', e.target.value)}
                            placeholder="e.g., A, B, C"
                          />
                        </div>
                        <div className="class-form-group">
                          <label>Section Name <span className="required">*</span></label>
                          <input
                            type="text"
                            value={section.section_name || ''}
                            onChange={(e) => handleSectionChange(index, 'section_name', e.target.value)}
                            placeholder="e.g., Section A"
                          />
                        </div>
                        <div className="class-form-group">
                          <label>Room ID</label>
                          <input
                            type="number"
                            value={section.room_id || ''}
                            onChange={(e) => handleSectionChange(index, 'room_id', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="Room ID"
                          />
                        </div>
                        <div className="class-form-group">
                          <label>Capacity</label>
                          <input
                            type="number"
                            value={section.capacity || 30}
                            onChange={(e) => handleSectionChange(index, 'capacity', e.target.value ? parseInt(e.target.value) : 30)}
                            placeholder="Max students"
                            min="1"
                            max="200"
                          />
                        </div>
                        <div className="class-form-group">
                          <label>Start Time</label>
                          <input
                            type="time"
                            value={section.start_time || ''}
                            onChange={(e) => handleSectionChange(index, 'start_time', e.target.value)}
                          />
                        </div>
                        <div className="class-form-group">
                          <label>End Time</label>
                          <input
                            type="time"
                            value={section.end_time || ''}
                            onChange={(e) => handleSectionChange(index, 'end_time', e.target.value)}
                          />
                        </div>
                        <div className="class-form-group">
                          <label>Display Order</label>
                          <input
                            type="number"
                            value={section.display_order || index + 1}
                            onChange={(e) => handleSectionChange(index, 'display_order', e.target.value ? parseInt(e.target.value) : index + 1)}
                            placeholder="Display order"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {submitError && (
          <div className="class-form-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {submitError}
          </div>
        )}
      </div>

      {/* Form Footer - Horizontal layout like Academic Year */}
      <div className="class-form-footer">
        <button type="button" className="class-btn-secondary" onClick={onCancel}>
          <i className="fa-regular fa-times"></i>
          Cancel
        </button>
        <button 
          type="submit" 
          className="class-btn-primary"
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
              {isEditing ? "Update Class" : "Create Class"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;