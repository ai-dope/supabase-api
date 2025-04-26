export interface IBaseRepository<T> {
    get(query?: Partial<T>, options?: { 
        limit?: number; 
        offset?: number;
        orderBy?: { column: keyof T; ascending?: boolean };
        select?: string;
    }): Promise<T[]>;
    create(data: T): Promise<T>;
    patch(data: Partial<T>, query: Partial<T>): Promise<T | null>;
    upsert(data: T, onConflict?: string): Promise<T>;
    delete(query: Partial<T>): Promise<boolean>;
    query(query: string, params?: any[]): Promise<T[]>;
    count(query?: Partial<T>): Promise<number>;
    exists(query: Partial<T>): Promise<boolean>;

    // Table management operations
    createTable(schema: TableSchema): Promise<void>;
    dropTable(): Promise<void>;
    listTables(): Promise<string[]>;
    tableExists(): Promise<boolean>;
}

export interface TableSchema {
    name: string;
    columns: {
        name: string;
        type: string;
        constraints?: string[];
    }[];
    primaryKey?: string;
    foreignKeys?: {
        column: string;
        references: {
            table: string;
            column: string;
        };
    }[];
} 