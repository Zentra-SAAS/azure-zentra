const { v4: uuidv4 } = require('uuid');
const { getTable } = require('../lib/db');
const { verifyToken, corsHeaders, respond } = require('../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    const user = verifyToken(req);
    if (!user) return respond(context, 401, { error: 'Unauthorized' });

    const billsTable    = getTable('Bills');
    const billItemsTable = getTable('BillItems');
    const productsTable  = getTable('Products');
    const shopId = user.organizationId;

    try {
        // GET — list all bills for this shop
        if (req.method === 'GET') {
            const bills = [];
            for await (const b of billsTable.listEntities({
                queryOptions: { filter: `PartitionKey eq '${shopId}'` }
            })) {
                bills.push({
                    id: b.rowKey,
                    total_amount: parseFloat(b.totalAmount || '0'),
                    payment_method: b.paymentMethod,
                    status: b.status,
                    customer_name: b.customerName || '',
                    createdAt: b.createdAt
                });
            }
            return respond(context, 200, bills);
        }

        // POST — create a new bill (checkout)
        if (req.method === 'POST') {
            const { items, total_amount, payment_method, customer_name } = req.body || {};
            if (!items || items.length === 0) {
                return respond(context, 400, { error: 'Cart items are required' });
            }

            const billId = uuidv4();

            // 1. Create the bill entity
            await billsTable.createEntity({
                partitionKey: shopId,
                rowKey: billId,
                cashierId: user.id,
                customerName: customer_name || '',
                totalAmount: String(total_amount || '0'),
                paymentMethod: payment_method || 'cash',
                status: 'completed',
                createdAt: new Date().toISOString()
            });

            // 2. Create bill items + update stock
            for (const item of items) {
                // Create bill item
                await billItemsTable.createEntity({
                    partitionKey: billId,
                    rowKey: uuidv4(),
                    productId: item.product_id,
                    quantity: String(item.quantity),
                    priceAtSale: String(item.price_at_sale),
                    subtotal: String((item.quantity * item.price_at_sale).toFixed(2))
                });

                // Decrement product stock
                try {
                    const product = await productsTable.getEntity(shopId, item.product_id);
                    const currentStock = parseInt(product.stockQuantity || '0');
                    const newStock = Math.max(0, currentStock - item.quantity);
                    await productsTable.updateEntity({
                        partitionKey: shopId,
                        rowKey: item.product_id,
                        stockQuantity: String(newStock)
                    }, 'Merge');
                } catch (stockErr) {
                    context.log.warn(`Stock update failed for product ${item.product_id}:`, stockErr.message);
                }
            }

            return respond(context, 201, { id: billId, status: 'completed' });
        }

        return respond(context, 405, { error: 'Method not allowed' });

    } catch (err) {
        context.log.error('Bills error:', err);
        return respond(context, 500, { error: 'Operation failed' });
    }
};
