"use client";

type SelectProps = {
  label: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function Select({
  label,
  options,
  value,
  onChange,
}: SelectProps) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>

      <select
        className="input"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}