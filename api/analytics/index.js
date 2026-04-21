const { getTable } = require('../lib/db');
const { verifyToken, corsHeaders, respond } = require('../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    const user = verifyToken(req);
    if (!user) return respond(context, 401, { error: 'Unauthorized' });

    const shopId = req.query.shopId || user.organizationId;

    try {
        const billsTable    = getTable('Bills');
        const billItemsTable = getTable('BillItems');
        const productsTable  = getTable('Products');
        const usersTable     = getTable('Users');

        // ── 1. Aggregate Bills ────────────────────────────────────────────────
        let totalRevenue = 0;
        let totalBills   = 0;
        const dailyMap = new Map();
        const allBills = [];

        for await (const b of billsTable.listEntities({
            queryOptions: { filter: `PartitionKey eq '${shopId}'` }
        })) {
            const amount = parseFloat(b.totalAmount || '0');
            totalRevenue += amount;
            totalBills++;
            allBills.push(b);

            // Group by date (YYYY-MM-DD)
            const day = (b.createdAt || '').substring(0, 10);
            dailyMap.set(day, (dailyMap.get(day) || 0) + amount);
        }

        const salesTrend = Array.from(dailyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, revenue]) => ({ date, revenue: revenue.toFixed(2) }));

        // ── 2. Products — low stock ───────────────────────────────────────────
        const lowStockProducts = [];
        const productNameMap = new Map();

        for await (const p of productsTable.listEntities({
            queryOptions: { filter: `PartitionKey eq '${shopId}'` }
        })) {
            productNameMap.set(p.rowKey, p.name);
            const stock     = parseInt(p.stockQuantity || '0');
            const threshold = parseInt(p.lowStockThreshold || '10');
            if (stock <= threshold) {
                lowStockProducts.push({ name: p.name, stock_quantity: stock });
            }
        }

        // ── 3. Employee count ─────────────────────────────────────────────────
        let totalEmployees = 0;
        for await (const _ of usersTable.listEntities({
            queryOptions: { filter: `organizationId eq '${shopId}'` }
        })) {
            totalEmployees++;
        }

        // ── 4. Top products by revenue from bill items ────────────────────────
        const productSales = new Map();

        for (const bill of allBills) {
            for await (const item of billItemsTable.listEntities({
                queryOptions: { filter: `PartitionKey eq '${bill.rowKey}'` }
            })) {
                const pid = item.productId;
                const existing = productSales.get(pid) || { name: productNameMap.get(pid) || pid, units: 0, revenue: 0 };
                existing.units   += parseFloat(item.quantity || '0');
                existing.revenue += parseFloat(item.subtotal || '0');
                productSales.set(pid, existing);
            }
        }

        const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                units_sold: p.units.toString(),
                revenue: p.revenue.toFixed(2)
            }));

        // ── 5. Return ─────────────────────────────────────────────────────────
        return respond(context, 200, {
            sales: {
                total_revenue: totalRevenue.toFixed(2),
                total_bills:   String(totalBills)
            },
            sales_trend:        salesTrend,
            low_stock_products: lowStockProducts,
            total_employees:    totalEmployees,
            top_products:       topProducts
        });

    } catch (err) {
        context.log.error('Analytics error:', err);
        return respond(context, 500, { error: 'Analytics failed' });
    }
};
