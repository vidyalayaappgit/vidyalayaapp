"use client";

type InputProps = {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>

      <input
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}