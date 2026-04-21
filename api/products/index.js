const { v4: uuidv4 } = require('uuid');
const { getTable } = require('../lib/db');
const { verifyToken, corsHeaders, respond } = require('../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    const user = verifyToken(req);
    if (!user) return respond(context, 401, { error: 'Unauthorized' });

    const productsTable = getTable('Products');
    // shopId can be passed as query param or defaults to user's org
    const shopId = req.query.shopId || user.organizationId;

    try {
        // GET — list all products for this shop
        if (req.method === 'GET') {
            const products = [];
            for await (const p of productsTable.listEntities({
                queryOptions: { filter: `PartitionKey eq '${shopId}'` }
            })) {
                products.push({
                    id: p.rowKey,
                    name: p.name,
                    description: p.description || '',
                    price: parseFloat(p.price || '0'),
                    cost_price: parseFloat(p.costPrice || '0'),
                    sku: p.sku || '',
                    stock_quantity: parseInt(p.stockQuantity || '0'),
                    low_stock_threshold: parseInt(p.lowStockThreshold || '10'),
                    category: p.category || '',
                    createdAt: p.createdAt
                });
            }
            return respond(context, 200, products);
        }

        // POST — create a product
        if (req.method === 'POST') {
            const { name, description, price, cost_price, sku, stock_quantity, low_stock_threshold, category } = req.body || {};
            if (!name) return respond(context, 400, { error: 'Product name required' });

            const productId = uuidv4();
            await productsTable.createEntity({
                partitionKey: shopId,
                rowKey: productId,
                name,
                description: description || '',
                price: String(price || '0'),
                costPrice: String(cost_price || '0'),
                sku: sku || '',
                stockQuantity: String(stock_quantity || '0'),
                lowStockThreshold: String(low_stock_threshold || '10'),
                category: category || '',
                createdAt: new Date().toISOString()
            });

            return respond(context, 201, { id: productId, name, price, stock_quantity });
        }

        // PUT — update a product
        if (req.method === 'PUT') {
            const { id, name, description, price, cost_price, sku, stock_quantity, low_stock_threshold, category } = req.body || {};
            if (!id) return respond(context, 400, { error: 'Product ID required' });

            await productsTable.updateEntity({
                partitionKey: shopId,
                rowKey: id,
                name,
                description: description || '',
                price: String(price || '0'),
                costPrice: String(cost_price || '0'),
                sku: sku || '',
                stockQuantity: String(stock_quantity || '0'),
                lowStockThreshold: String(low_stock_threshold || '10'),
                category: category || ''
            }, 'Merge');

            return respond(context, 200, { success: true });
        }

        // DELETE — remove a product
        if (req.method === 'DELETE') {
            const id = req.query.id;
            if (!id) return respond(context, 400, { error: 'Product ID required' });
            await productsTable.deleteEntity(shopId, id);
            return respond(context, 200, { success: true });
        }

        return respond(context, 405, { error: 'Method not allowed' });

    } catch (err) {
        context.log.error('Products error:', err);
        return respond(context, 500, { error: 'Operation failed' });
    }
};
