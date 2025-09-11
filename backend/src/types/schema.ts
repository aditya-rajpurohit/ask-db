
// Schema info type: each table with its columns
export interface TableSchema {
    name: string;
    columns: string[];
}

export interface Relationship {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
}


export interface DatabaseSchema {
    tables: TableSchema[];
    relationships: Relationship[];
}