interface DataTableProps {
    columns: string[];
    data: any[];
}

export default function DataTable({ columns, data }: DataTableProps) {
    if (!data || data.length === 0) return <p className="text-gray-500">No results</p>;

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-200">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-3 py-2 font-medium text-gray-700">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rIdx) => (
                        <tr key={rIdx} className="border-t">
                            {columns.map((col, cIdx) => (
                                <td key={cIdx} className="px-3 py-2">
                                    {String(row[col])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}