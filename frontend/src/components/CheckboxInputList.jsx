// src/components/CheckboxInputList.jsx
export default function CheckboxInputList({
    labels,
    numericLabels,
    dropdownOptions,
    rows,
    setRows
  }) {
    const updateRow = (i, value, field) => {
      const newRows = [...rows];
      newRows[i][field] = value;
      setRows(newRows);
    };
  
    return (
      <div className="space-y-2">
        {rows.map((row, i) => {
          const label     = labels[i];
          const isNumeric = numericLabels.includes(label);
          const htmlFor   = `field-${i}`;
  
          return (
            <div key={i} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={row.checked}
                onChange={e => updateRow(i, e.target.checked, 'checked')}
                className="w-4 h-4"
              />
  
              <label htmlFor={htmlFor} className="font-medium w-32">
                {label}
              </label>
  
              {isNumeric ? (
                <select
                  id={htmlFor}
                  value={row.text}
                  onChange={e => updateRow(i, e.target.value, 'text')}
                  className="border px-2 py-1 flex-1"
                >
                  <option value="">—</option>
                  {dropdownOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={htmlFor}
                  type="text"
                  value={row.text}
                  onChange={e => updateRow(i, e.target.value, 'text')}
                  placeholder="Enter text…"
                  className="border px-2 py-1 flex-1"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
  