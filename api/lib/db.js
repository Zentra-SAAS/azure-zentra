const { TableClient, TableServiceClient } = require('@azure/data-tables');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const TABLE_NAMES = ['Shops', 'Users', 'Products', 'Bills', 'BillItems'];

/**
 * Get a TableClient for a specific table
 */
function getTable(tableName) {
    return TableClient.fromConnectionString(connectionString, tableName);
}

/**
 * Ensure all required tables exist (idempotent — safe to call on every request)
 */
async function ensureTables() {
    const serviceClient = TableServiceClient.fromConnectionString(connectionString);
    for (const tableName of TABLE_NAMES) {
        try {
            await serviceClient.createTable(tableName);
        } catch (err) {
            // 409 = table already exists — ignore
            if (err.statusCode !== 409) throw err;
        }
    }
}

module.exports = { getTable, ensureTables };
