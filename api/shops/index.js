const { v4: uuidv4 } = require('uuid');
const { getTable } = require('../lib/db');
const { verifyToken, corsHeaders, respond } = require('../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    const user = verifyToken(req);
    if (!user) return respond(context, 401, { error: 'Unauthorized' });

    const shopsTable = getTable('Shops');

    try {
        // GET — list all shops managed by this user
        if (req.method === 'GET') {
            const shops = [];
            for await (const shop of shopsTable.listEntities({
                queryOptions: { filter: `managerId eq '${user.id}'` }
            })) {
                shops.push({
                    id: shop.rowKey,
                    name: shop.name,
                    managerId: shop.managerId,
                    orgCode: shop.orgCode,
                    createdAt: shop.createdAt
                });
            }
            return respond(context, 200, shops);
        }

        // POST — create a new shop/branch
        if (req.method === 'POST') {
            const { name } = req.body || {};
            if (!name) return respond(context, 400, { error: 'Shop name required' });

            const shopId = uuidv4();
            const orgCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            await shopsTable.createEntity({
                partitionKey: 'shops',
                rowKey: shopId,
                name,
                managerId: user.id,
                orgCode,
                createdAt: new Date().toISOString()
            });

            return respond(context, 201, { id: shopId, name, orgCode });
        }

        // DELETE — remove a shop
        if (req.method === 'DELETE') {
            const shopId = req.query.id;
            if (!shopId) return respond(context, 400, { error: 'Shop ID required' });
            await shopsTable.deleteEntity('shops', shopId);
            return respond(context, 200, { success: true });
        }

        return respond(context, 405, { error: 'Method not allowed' });

    } catch (err) {
        context.log.error('Shops error:', err);
        return respond(context, 500, { error: 'Operation failed' });
    }
};
