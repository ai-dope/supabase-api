"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
const supabase_client_factory_1 = require("../factory/supabase.client.factory");
class DatabaseRepository {
    constructor(tableName) {
        this.client = supabase_client_factory_1.SupabaseClientFactory.getInstance().getClient();
        this.tableName = tableName;
    }
    async get(query = {}, options) {
        var _a;
        let supabaseQuery = this.client
            .from(this.tableName)
            .select((options === null || options === void 0 ? void 0 : options.select) || '*');
        // Apply query filters
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined) {
                supabaseQuery = supabaseQuery.eq(key, value);
            }
        });
        // Apply ordering
        if (options === null || options === void 0 ? void 0 : options.orderBy) {
            supabaseQuery = supabaseQuery.order(options.orderBy.column, { ascending: (_a = options.orderBy.ascending) !== null && _a !== void 0 ? _a : true });
        }
        // Apply pagination
        if (options === null || options === void 0 ? void 0 : options.limit) {
            supabaseQuery = supabaseQuery.limit(options.limit);
        }
        if (options === null || options === void 0 ? void 0 : options.offset) {
            supabaseQuery = supabaseQuery.range(options.offset, options.offset + (options.limit || 10) - 1);
        }
        const { data, error } = await supabaseQuery;
        if (error)
            throw error;
        return (data || []);
    }
    async create(data) {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .insert(data)
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async patch(data, query) {
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
        if (error)
            throw error;
        return result;
    }
    async upsert(data, onConflict) {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .upsert(data, { onConflict })
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
    async delete(query) {
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
        if (error)
            throw error;
        return true;
    }
    async query(query, params) {
        const { data, error } = await this.client.rpc('execute_sql', {
            query,
            params: params || []
        });
        if (error)
            throw error;
        return data;
    }
    // Additional Supabase-specific methods
    async count(query = {}) {
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
        if (error)
            throw error;
        return count || 0;
    }
    async exists(query) {
        const count = await this.count(query);
        return count > 0;
    }
    async createTable(schema) {
        var _a;
        const columns = schema.columns.map(col => {
            const constraints = col.constraints || [];
            if (schema.primaryKey === col.name) {
                constraints.push('PRIMARY KEY');
            }
            return `${col.name} ${col.type} ${constraints.join(' ')}`;
        }).join(', ');
        const foreignKeys = (_a = schema.foreignKeys) === null || _a === void 0 ? void 0 : _a.map(fk => `FOREIGN KEY (${fk.column}) REFERENCES ${fk.references.table}(${fk.references.column})`).join(', ');
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
        if (error)
            throw error;
    }
    async dropTable() {
        const { error } = await this.client.rpc('execute_sql', {
            query: `DROP TABLE IF EXISTS ${this.tableName}`,
            params: []
        });
        if (error)
            throw error;
    }
    async listTables() {
        const { data, error } = await this.client.rpc('execute_sql', {
            query: `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `,
            params: []
        });
        if (error)
            throw error;
        return data.map((row) => row.table_name);
    }
    async tableExists() {
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
        if (error)
            throw error;
        return data[0].exists;
    }
}
exports.DatabaseRepository = DatabaseRepository;
