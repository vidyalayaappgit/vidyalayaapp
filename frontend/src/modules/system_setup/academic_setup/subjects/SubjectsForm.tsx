"use client";

import React, { useState, useEffect } from 'react';
import { useCreateSubject, useUpdateSubject, useSchoolId, useStatusOptions } from './subjects.hooks';
import { Subject } from './subjects.types';
import '@/styles/components/subjects.css';

interface SubjectsFormProps {
  initialData?: Subject;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SubjectsForm: React.FC<SubjectsFormProps> = ({ 
  initialData, 
  onSuccess, 
  onCancel 
}) => {
  const isEditing = !!initialData?.id;
  const schoolId = useSchoolId();
  const { statusOptions, isLoading: statusOptionsLoading } = useStatusOptions(8);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'mappings'>('basic');

  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    subjectShortName: '',
    subjectType: 'Core',
    subjectCategoryId: '',
    languageGroupId: '',
    subjectLevel: '1',
    parentSubjectId: '',
    defaultTheoryCredits: '0',
    defaultPracticalCredits: '0',
    defaultPassingMarksTheory: '33',
    defaultPassingMarksPractical: '33',
    defaultMaxMarksTheory: '100',
    defaultMaxMarksPractical: '100',
    defaultMinAttendancePercent: '75',
    isGradeOnly: false,
    hasPractical: false,
    defaultPracticalGroupSize: '',
    labRequired: false,
    labId: '',
    isOptional: false,
    isCoScholastic: false,
    coScholasticAreaId: '',
    globalDisplayOrder: '0',
    description: '',
    status: '', // Add status field for editing
  });

  const [classMappings, setClassMappings] = useState<any[]>([]);
  const [mappingsToDelete, setMappingsToDelete] = useState<number[]>([]);

  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectCode: initialData.subjectCode || '',
        subjectName: initialData.subjectName || '',
        subjectShortName: initialData.subjectShortName || '',
        subjectType: initialData.subjectType || 'Core',
        subjectCategoryId: initialData.subjectCategoryId?.toString() || '',
        languageGroupId: initialData.languageGroupId?.toString() || '',
        subjectLevel: initialData.subjectLevel?.toString() || '1',
        parentSubjectId: initialData.parentSubjectId?.toString() || '',
        defaultTheoryCredits: initialData.defaultTheoryCredits?.toString() || '0',
        defaultPracticalCredits: initialData.defaultPracticalCredits?.toString() || '0',
        defaultPassingMarksTheory: initialData.defaultPassingMarksTheory?.toString() || '33',
        defaultPassingMarksPractical: initialData.defaultPassingMarksPractical?.toString() || '33',
        defaultMaxMarksTheory: initialData.defaultMaxMarksTheory?.toString() || '100',
        defaultMaxMarksPractical: initialData.defaultMaxMarksPractical?.toString() || '100',
        defaultMinAttendancePercent: initialData.defaultMinAttendancePercent?.toString() || '75',
        isGradeOnly: initialData.isGradeOnly || false,
        hasPractical: initialData.hasPractical || false,
        defaultPracticalGroupSize: initialData.defaultPracticalGroupSize?.toString() || '',
        labRequired: initialData.labRequired || false,
        labId: initialData.labId?.toString() || '',
        isOptional: initialData.isOptional || false,
        isCoScholastic: initialData.isCoScholastic || false,
        coScholasticAreaId: initialData.coScholasticAreaId?.toString() || '',
        globalDisplayOrder: initialData.globalDisplayOrder?.toString() || '0',
        description: initialData.description || '',
        status: initialData.status || '',
      });

      if (initialData.classMappings && initialData.classMappings.length > 0) {
        setClassMappings(initialData.classMappings.map(m => ({
          id: m.id,
          class_id: m.class_id,
          class_name: m.class_name,
          subject_number: m.subject_number,
          theory_hours_per_week: m.theory_hours_per_week,
          practical_hours_per_week: m.practical_hours_per_week,
          is_taught: m.is_taught,
          theory_credits: m.theory_credits,
          practical_credits: m.practical_credits,
          passing_marks_theory: m.passing_marks_theory,
          passing_marks_practical: m.passing_marks_practical,
          max_marks_theory: m.max_marks_theory,
          max_marks_practical: m.max_marks_practical,
          min_attendance_percent: m.min_attendance_percent,
          is_optional: m.is_optional,
          suggested_teacher_id: m.suggested_teacher_id,
        })));
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleMappingChange = (index: number, field: string, value: any) => {
    const updatedMappings = [...classMappings];
    updatedMappings[index] = { ...updatedMappings[index], [field]: value };
    setClassMappings(updatedMappings);
  };

  const addClassMapping = () => {
    setClassMappings([
      ...classMappings,
      {
        class_id: undefined,
        subject_number: classMappings.length + 1,
        theory_hours_per_week: 0,
        practical_hours_per_week: 0,
        is_taught: true,
        theory_credits: 0,
        practical_credits: 0,
        passing_marks_theory: 33,
        passing_marks_practical: 33,
        max_marks_theory: 100,
        max_marks_practical: 100,
        min_attendance_percent: 75,
        is_optional: false,
      }
    ]);
  };

  const removeClassMapping = (index: number) => {
    const mapping = classMappings[index];
    if (mapping.id) {
      setMappingsToDelete([...mappingsToDelete, mapping.id]);
    }
    const updatedMappings = classMappings.filter((_, i) => i !== index);
    setClassMappings(updatedMappings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!schoolId) {
      setSubmitError('School context not found. Please login again.');
      return;
    }

    if (!formData.subjectCode.trim()) {
      setSubmitError('Subject code is required');
      return;
    }

    if (!formData.subjectName.trim()) {
      setSubmitError('Subject name is required');
      return;
    }

    // Validate class mappings
    for (let i = 0; i < classMappings.length; i++) {
      const mapping = classMappings[i];
      if (!mapping.class_id) {
        setSubmitError(`Class mapping ${i + 1}: Class ID is required`);
        return;
      }
    }

    try {
      if (isEditing && initialData?.id) {
        // Update existing subject
        const updatePayload: any = {
          id: initialData.id,
          schoolId: schoolId,
          subjectCode: formData.subjectCode.trim(),
          subjectName: formData.subjectName.trim(),
        };

        if (formData.subjectShortName) updatePayload.subjectShortName = formData.subjectShortName;
        if (formData.subjectType) updatePayload.subjectType = formData.subjectType;
        if (formData.subjectCategoryId) updatePayload.subjectCategoryId = parseInt(formData.subjectCategoryId);
        if (formData.languageGroupId) updatePayload.languageGroupId = parseInt(formData.languageGroupId);
        if (formData.subjectLevel) updatePayload.subjectLevel = parseInt(formData.subjectLevel);
        if (formData.parentSubjectId) updatePayload.parentSubjectId = parseInt(formData.parentSubjectId);
        if (formData.defaultTheoryCredits) updatePayload.defaultTheoryCredits = parseFloat(formData.defaultTheoryCredits);
        if (formData.defaultPracticalCredits) updatePayload.defaultPracticalCredits = parseFloat(formData.defaultPracticalCredits);
        if (formData.defaultPassingMarksTheory) updatePayload.defaultPassingMarksTheory = parseInt(formData.defaultPassingMarksTheory);
        if (formData.defaultPassingMarksPractical) updatePayload.defaultPassingMarksPractical = parseInt(formData.defaultPassingMarksPractical);
        if (formData.defaultMaxMarksTheory) updatePayload.defaultMaxMarksTheory = parseInt(formData.defaultMaxMarksTheory);
        if (formData.defaultMaxMarksPractical) updatePayload.defaultMaxMarksPractical = parseInt(formData.defaultMaxMarksPractical);
        if (formData.defaultMinAttendancePercent) updatePayload.defaultMinAttendancePercent = parseFloat(formData.defaultMinAttendancePercent);
        
        updatePayload.isGradeOnly = formData.isGradeOnly;
        updatePayload.hasPractical = formData.hasPractical;
        updatePayload.labRequired = formData.labRequired;
        updatePayload.isOptional = formData.isOptional;
        updatePayload.isCoScholastic = formData.isCoScholastic;
        
        if (formData.defaultPracticalGroupSize) updatePayload.defaultPracticalGroupSize = parseInt(formData.defaultPracticalGroupSize);
        if (formData.labId) updatePayload.labId = parseInt(formData.labId);
        if (formData.coScholasticAreaId) updatePayload.coScholasticAreaId = parseInt(formData.coScholasticAreaId);
        if (formData.globalDisplayOrder) updatePayload.globalDisplayOrder = parseInt(formData.globalDisplayOrder);
        if (formData.description) updatePayload.description = formData.description;
        
        // Add status if changed (for edit mode)
        if (formData.status && formData.status !== initialData.status) {
          updatePayload.status = formData.status;
        }

        // Prepare class mappings for update
        if (classMappings.length > 0) {
          updatePayload.classMappings = classMappings.map(m => ({
            id: m.id,
            classId: m.class_id,
            subjectNumber: m.subject_number,
            theoryHoursPerWeek: m.theory_hours_per_week,
            practicalHoursPerWeek: m.practical_hours_per_week,
            isTaught: m.is_taught,
            theoryCredits: m.theory_credits,
            practicalCredits: m.practical_credits,
            passingMarksTheory: m.passing_marks_theory,
            passingMarksPractical: m.passing_marks_practical,
            maxMarksTheory: m.max_marks_theory,
            maxMarksPractical: m.max_marks_practical,
            minAttendancePercent: m.min_attendance_percent,
            isOptional: m.is_optional,
            suggestedTeacherId: m.suggested_teacher_id,
          }));
        }

        if (mappingsToDelete.length > 0) {
          updatePayload.mappingsToDelete = mappingsToDelete;
        }

        await updateMutation.mutateAsync(updatePayload);
      } else {
        // Create new subject
        const createPayload: any = {
          schoolId: schoolId,
          subjectCode: formData.subjectCode.trim(),
          subjectName: formData.subjectName.trim(),
        };

        if (formData.subjectShortName) createPayload.subjectShortName = formData.subjectShortName;
        if (formData.subjectType) createPayload.subjectType = formData.subjectType;
        if (formData.subjectCategoryId) createPayload.subjectCategoryId = parseInt(formData.subjectCategoryId);
        if (formData.languageGroupId) createPayload.languageGroupId = parseInt(formData.languageGroupId);
        if (formData.subjectLevel) createPayload.subjectLevel = parseInt(formData.subjectLevel);
        if (formData.parentSubjectId) createPayload.parentSubjectId = parseInt(formData.parentSubjectId);
        if (formData.defaultTheoryCredits) createPayload.defaultTheoryCredits = parseFloat(formData.defaultTheoryCredits);
        if (formData.defaultPracticalCredits) createPayload.defaultPracticalCredits = parseFloat(formData.defaultPracticalCredits);
        if (formData.defaultPassingMarksTheory) createPayload.defaultPassingMarksTheory = parseInt(formData.defaultPassingMarksTheory);
        if (formData.defaultPassingMarksPractical) createPayload.defaultPassingMarksPractical = parseInt(formData.defaultPassingMarksPractical);
        if (formData.defaultMaxMarksTheory) createPayload.defaultMaxMarksTheory = parseInt(formData.defaultMaxMarksTheory);
        if (formData.defaultMaxMarksPractical) createPayload.defaultMaxMarksPractical = parseInt(formData.defaultMaxMarksPractical);
        if (formData.defaultMinAttendancePercent) createPayload.defaultMinAttendancePercent = parseFloat(formData.defaultMinAttendancePercent);
        
        createPayload.isGradeOnly = formData.isGradeOnly;
        createPayload.hasPractical = formData.hasPractical;
        createPayload.labRequired = formData.labRequired;
        createPayload.isOptional = formData.isOptional;
        createPayload.isCoScholastic = formData.isCoScholastic;
        
        if (formData.defaultPracticalGroupSize) createPayload.defaultPracticalGroupSize = parseInt(formData.defaultPracticalGroupSize);
        if (formData.labId) createPayload.labId = parseInt(formData.labId);
        if (formData.coScholasticAreaId) createPayload.coScholasticAreaId = parseInt(formData.coScholasticAreaId);
        if (formData.globalDisplayOrder) createPayload.globalDisplayOrder = parseInt(formData.globalDisplayOrder);
        if (formData.description) createPayload.description = formData.description;

        // Prepare class mappings for create
        if (classMappings.length > 0) {
          createPayload.classMappings = classMappings.map(m => ({
            classId: m.class_id,
            subjectNumber: m.subject_number,
            theoryHoursPerWeek: m.theory_hours_per_week,
            practicalHoursPerWeek: m.practical_hours_per_week,
            isTaught: m.is_taught,
            theoryCredits: m.theory_credits,
            practicalCredits: m.practical_credits,
            passingMarksTheory: m.passing_marks_theory,
            passingMarksPractical: m.passing_marks_practical,
            maxMarksTheory: m.max_marks_theory,
            maxMarksPractical: m.max_marks_practical,
            minAttendancePercent: m.min_attendance_percent,
            isOptional: m.is_optional,
            suggestedTeacherId: m.suggested_teacher_id,
          }));
        }

        await createMutation.mutateAsync(createPayload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError((error as Error).message);
    }
  };

  // Get status description for tooltip
  const getStatusDescription = (statusName: string) => {
    const status = statusOptions.find(s => s.status_name === statusName);
    return status?.status_desc || '';
  };

  return (
    <form onSubmit={handleSubmit} className="subject-form-container">
      <div className="subject-tabs">
        <button 
          type="button" 
          className={`subject-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <i className="fas fa-info-circle"></i> Basic Info
        </button>
        <button 
          type="button" 
          className={`subject-tab ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          <i className="fas fa-graduation-cap"></i> Academic Settings
        </button>
        <button 
          type="button" 
          className={`subject-tab ${activeTab === 'mappings' ? 'active' : ''}`}
          onClick={() => setActiveTab('mappings')}
        >
          <i className="fas fa-layer-group"></i> Class Mappings ({classMappings.length})
        </button>
      </div>

      <div className="subject-form-body">
        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="subject-form-section">
            <div className="subject-form-grid-2">
              <div className="subject-form-group">
                <label>Subject Code <span className="required">*</span></label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-hashtag"></i>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    placeholder="e.g., SUB-MAT-101"
                    required
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Subject Name <span className="required">*</span></label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-book"></i>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Short Name</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-tag"></i>
                  <input
                    type="text"
                    name="subjectShortName"
                    value={formData.subjectShortName}
                    onChange={handleChange}
                    placeholder="e.g., Math"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Subject Type</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-layer-group"></i>
                  <select name="subjectType" value={formData.subjectType} onChange={handleChange}>
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                    <option value="Both">Both</option>
                    <option value="Remedial">Remedial</option>
                  </select>
                </div>
              </div>

              <div className="subject-form-group">
                <label>Subject Category</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-folder"></i>
                  <select name="subjectCategoryId" value={formData.subjectCategoryId} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="1">Science</option>
                    <option value="2">Commerce</option>
                    <option value="3">Arts</option>
                    <option value="4">Language</option>
                    <option value="5">Vocational</option>
                  </select>
                </div>
              </div>

              <div className="subject-form-group">
                <label>Language Group</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-language"></i>
                  <select name="languageGroupId" value={formData.languageGroupId} onChange={handleChange}>
                    <option value="">Select Language Group</option>
                    <option value="1">First Language</option>
                    <option value="2">Second Language</option>
                    <option value="3">Third Language</option>
                  </select>
                </div>
              </div>

              <div className="subject-form-group">
                <label>Subject Level</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-chart-line"></i>
                  <select name="subjectLevel" value={formData.subjectLevel} onChange={handleChange}>
                    <option value="1">Beginner</option>
                    <option value="2">Intermediate</option>
                    <option value="3">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="subject-form-group">
                <label>Display Order</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-arrow-down-1-9"></i>
                  <input
                    type="number"
                    name="globalDisplayOrder"
                    value={formData.globalDisplayOrder}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              {/* Status Field - Only visible when editing */}
              {isEditing && (
                <div className="subject-form-group">
                  <label>Status</label>
                  <div className="subject-input-icon-wrapper">
                    <i className="fas fa-flag-checkered"></i>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange}
                      disabled={statusOptionsLoading}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status.status_id} value={status.status_name}>
                          {status.status_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.status && getStatusDescription(formData.status) && (
                    <small className="subject-field-help">
                      <i className="fas fa-info-circle"></i> {getStatusDescription(formData.status)}
                    </small>
                  )}
                  {statusOptionsLoading && (
                    <small className="subject-field-help">
                      <i className="fas fa-spinner fa-spin"></i> Loading status options...
                    </small>
                  )}
                </div>
              )}

              <div className="subject-form-group subject-form-grid-full">
                <label>Description</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-align-left"></i>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Subject description..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic Settings */}
        {activeTab === 'academic' && (
          <div className="subject-form-section">
            <div className="subject-form-grid-2">
              <div className="subject-form-group">
                <label>Theory Credits</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-star"></i>
                  <input
                    type="number"
                    name="defaultTheoryCredits"
                    value={formData.defaultTheoryCredits}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Practical Credits</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-flask"></i>
                  <input
                    type="number"
                    name="defaultPracticalCredits"
                    value={formData.defaultPracticalCredits}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Passing Marks (Theory)</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-check-circle"></i>
                  <input
                    type="number"
                    name="defaultPassingMarksTheory"
                    value={formData.defaultPassingMarksTheory}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Passing Marks (Practical)</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-check-circle"></i>
                  <input
                    type="number"
                    name="defaultPassingMarksPractical"
                    value={formData.defaultPassingMarksPractical}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Max Marks (Theory)</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-trophy"></i>
                  <input
                    type="number"
                    name="defaultMaxMarksTheory"
                    value={formData.defaultMaxMarksTheory}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Max Marks (Practical)</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-trophy"></i>
                  <input
                    type="number"
                    name="defaultMaxMarksPractical"
                    value={formData.defaultMaxMarksPractical}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Min Attendance (%)</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-calendar-check"></i>
                  <input
                    type="number"
                    name="defaultMinAttendancePercent"
                    value={formData.defaultMinAttendancePercent}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="subject-form-group">
                <label>Practical Group Size</label>
                <div className="subject-input-icon-wrapper">
                  <i className="fas fa-users"></i>
                  <input
                    type="number"
                    name="defaultPracticalGroupSize"
                    value={formData.defaultPracticalGroupSize}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="subject-form-group subject-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasPractical"
                    checked={formData.hasPractical}
                    onChange={handleChange}
                  />
                  <span>Has Practical Component</span>
                </label>
              </div>

              <div className="subject-form-group subject-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="labRequired"
                    checked={formData.labRequired}
                    onChange={handleChange}
                  />
                  <span>Lab Required</span>
                </label>
              </div>

              <div className="subject-form-group subject-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isGradeOnly"
                    checked={formData.isGradeOnly}
                    onChange={handleChange}
                  />
                  <span>Grade Only (No Marks)</span>
                </label>
              </div>

              <div className="subject-form-group subject-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isOptional"
                    checked={formData.isOptional}
                    onChange={handleChange}
                  />
                  <span>Optional Subject</span>
                </label>
              </div>

              <div className="subject-form-group subject-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isCoScholastic"
                    checked={formData.isCoScholastic}
                    onChange={handleChange}
                  />
                  <span>Co-Scholastic Subject</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Class Mappings */}
        {activeTab === 'mappings' && (
          <div className="subject-form-section">
            <div className="subject-mappings-header">
              <button type="button" className="subject-add-mapping-btn" onClick={addClassMapping}>
                <i className="fas fa-plus"></i> Add Class Mapping
              </button>
            </div>
            
            {classMappings.length === 0 ? (
              <div className="subject-empty-state">
                <i className="fas fa-folder-open"></i>
                <p>No class mappings added yet. Click "Add Class Mapping" to create one.</p>
              </div>
            ) : (
              <div className="subject-mappings-list">
                {classMappings.map((mapping, index) => (
                  <div key={index} className="subject-mapping-card">
                    <div className="subject-mapping-header">
                      <div className="subject-mapping-title">
                        <i className="fas fa-chalkboard"></i>
                        <span>Class Mapping {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        className="subject-remove-mapping-btn"
                        onClick={() => removeClassMapping(index)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    <div className="subject-mapping-body">
                      <div className="subject-form-grid-3">
                        <div className="subject-form-group">
                          <label>Class ID <span className="required">*</span></label>
                          <input
                            type="number"
                            value={mapping.class_id || ''}
                            onChange={(e) => handleMappingChange(index, 'class_id', parseInt(e.target.value))}
                            placeholder="Class ID"
                            required
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Subject Number</label>
                          <input
                            type="number"
                            value={mapping.subject_number || ''}
                            onChange={(e) => handleMappingChange(index, 'subject_number', parseInt(e.target.value))}
                            placeholder="Subject Number"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Theory Hours/Week</label>
                          <input
                            type="number"
                            value={mapping.theory_hours_per_week || 0}
                            onChange={(e) => handleMappingChange(index, 'theory_hours_per_week', parseInt(e.target.value))}
                            min="0"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Practical Hours/Week</label>
                          <input
                            type="number"
                            value={mapping.practical_hours_per_week || 0}
                            onChange={(e) => handleMappingChange(index, 'practical_hours_per_week', parseInt(e.target.value))}
                            min="0"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Theory Credits</label>
                          <input
                            type="number"
                            value={mapping.theory_credits || 0}
                            onChange={(e) => handleMappingChange(index, 'theory_credits', parseFloat(e.target.value))}
                            step="0.5"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Practical Credits</label>
                          <input
                            type="number"
                            value={mapping.practical_credits || 0}
                            onChange={(e) => handleMappingChange(index, 'practical_credits', parseFloat(e.target.value))}
                            step="0.5"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Passing Marks (Theory)</label>
                          <input
                            type="number"
                            value={mapping.passing_marks_theory || 33}
                            onChange={(e) => handleMappingChange(index, 'passing_marks_theory', parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Passing Marks (Practical)</label>
                          <input
                            type="number"
                            value={mapping.passing_marks_practical || 33}
                            onChange={(e) => handleMappingChange(index, 'passing_marks_practical', parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Max Marks (Theory)</label>
                          <input
                            type="number"
                            value={mapping.max_marks_theory || 100}
                            onChange={(e) => handleMappingChange(index, 'max_marks_theory', parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Max Marks (Practical)</label>
                          <input
                            type="number"
                            value={mapping.max_marks_practical || 100}
                            onChange={(e) => handleMappingChange(index, 'max_marks_practical', parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Min Attendance (%)</label>
                          <input
                            type="number"
                            value={mapping.min_attendance_percent || 75}
                            onChange={(e) => handleMappingChange(index, 'min_attendance_percent', parseFloat(e.target.value))}
                            step="0.5"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="subject-form-group">
                          <label>Suggested Teacher ID</label>
                          <input
                            type="number"
                            value={mapping.suggested_teacher_id || ''}
                            onChange={(e) => handleMappingChange(index, 'suggested_teacher_id', parseInt(e.target.value))}
                            placeholder="Teacher ID"
                          />
                        </div>
                        <div className="subject-form-group subject-checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={mapping.is_taught || false}
                              onChange={(e) => handleMappingChange(index, 'is_taught', e.target.checked)}
                            />
                            <span>Is Taught</span>
                          </label>
                        </div>
                        <div className="subject-form-group subject-checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={mapping.is_optional || false}
                              onChange={(e) => handleMappingChange(index, 'is_optional', e.target.checked)}
                            />
                            <span>Optional</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {submitError && (
          <div className="subject-form-error">
            <i className="fas fa-exclamation-circle"></i>
            {submitError}
          </div>
        )}
      </div>

      <div className="subject-form-footer">
        <button type="button" className="subject-btn-secondary" onClick={onCancel}>
          <i className="fas fa-times"></i>
          Cancel
        </button>
        <button 
          type="submit" 
          className="subject-btn-primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {(createMutation.isPending || updateMutation.isPending) ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              {isEditing ? "Update Subject" : "Create Subject"}
 </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SubjectsForm;