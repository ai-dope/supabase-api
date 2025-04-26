import { SupabaseClient } from '@supabase/supabase-js';
import { IBaseRepository, TableSchema } from './base.repository';
import { SupabaseClientFactory } from '../factory/supabase.client.factory';

export class DatabaseRepository<T> implements IBaseRepository<T> {
    protected client: SupabaseClient;
    protected tableName: string;

    constructor(tableName: string) {
        this.client = SupabaseClientFactory.getInstance().getClient();
        this.tableName = tableName;
    }

    async get(query: Partial<T> = {}, options?: { 
        limit?: number; 
        offset?: number;
        orderBy?: { column: keyof T; ascending?: boolean };
        select?: string;
    }): Promise<T[]> {
        let supabaseQuery = this.client
            .from(this.tableName)
            .select(options?.select || '*');

        // Apply query filters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                supabaseQuery = supabaseQuery.eq(key, value);
            }
        });

        // Apply ordering
        if (options?.orderBy) {
            supabaseQuery = supabaseQuery.order(
                options.orderBy.column as string,
                { ascending: options.orderBy.ascending ?? true }
            );
        }

        // Apply pagination
        if (options?.limit) {
            supabaseQuery = supabaseQuery.limit(options.limit);
        }

        if (options?.offset) {
            supabaseQuery = supabaseQuery.range(options.offset, options.offset + (options.limit || 10) - 1);
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;
        return (data || []) as T[];
    }

    async create(data: T): Promise<T> {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async patch(data: Partial<T>, query: Partial<T>): Promise<T | null> {
        let supabaseQuery = this.client
            .from(this.tableName)
            .update(data);

        // Apply query filters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                supabaseQuery = supabaseQuery.eq(key, value);
            }
        });

        const { data: result, error } = await supabaseQuery
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async upsert(data: T, onConflict?: string): Promise<T> {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .upsert(data, { onConflict })
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async delete(query: Partial<T>): Promise<boolean> {
        let supabaseQuery = this.client
            .from(this.tableName)
            .delete();

        // Apply query filters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                supabaseQuery = supabaseQuery.eq(key, value);
            }
        });

        const { error } = await supabaseQuery;

        if (error) throw error;
        return true;
    }

    async query(query: string, params?: any[]): Promise<T[]> {
        const { data, error } = await this.client.rpc('execute_sql', {
            query,
            params: params || []
        });

        if (error) throw error;
        return data as T[];
    }

    // Additional Supabase-specific methods
    async count(query: Partial<T> = {}): Promise<number> {
        let supabaseQuery = this.client
            .from(this.tableName)
            .select('*', { count: 'exact', head: true });

        // Apply query filters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                supabaseQuery = supabaseQuery.eq(key, value);
            }
        });

        const { count, error } = await supabaseQuery;

        if (error) throw error;
        return count || 0;
    }

    async exists(query: Partial<T>): Promise<boolean> {
        const count = await this.count(query);
        return count > 0;
    }

    async createTable(schema: TableSchema): Promise<void> {
        const columns = schema.columns.map(col => {
            const constraints = col.constraints || [];
            if (schema.primaryKey === col.name) {
                constraints.push('PRIMARY KEY');
            }
            return `${col.name} ${col.type} ${constraints.join(' ')}`;
        }).join(', ');

        const foreignKeys = schema.foreignKeys?.map(fk => 
            `FOREIGN KEY (${fk.column}) REFERENCES ${fk.references.table}(${fk.references.column})`
        ).join(', ');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${schema.name} (
                ${columns}
                ${foreignKeys ? `, ${foreignKeys}` : ''}
            )
        `;

        const { error } = await this.client.rpc('execute_sql', {
            query: createTableQuery,
            params: []
        });

        if (error) throw error;
    }

    async dropTable(): Promise<void> {
        const { error } = await this.client.rpc('execute_sql', {
            query: `DROP TABLE IF EXISTS ${this.tableName}`,
            params: []
        });

        if (error) throw error;
    }

    async listTables(): Promise<string[]> {
        const { data, error } = await this.client.rpc('execute_sql', {
            query: `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `,
            params: []
        });

        if (error) throw error;
        return data.map((row: any) => row.table_name);
    }

    async tableExists(): Promise<boolean> {
        const { data, error } = await this.client.rpc('execute_sql', {
            query: `
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )
            `,
            params: [this.tableName]
        });

        if (error) throw error;
        return data[0].exists;
    }
} 