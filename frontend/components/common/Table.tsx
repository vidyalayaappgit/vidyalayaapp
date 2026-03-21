"use client";

type Column = {
  key: string;
  label: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
};

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}