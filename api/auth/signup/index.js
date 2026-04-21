const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { getTable, ensureTables } = require('../../lib/db');
const { signToken, corsHeaders, respond } = require('../../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    try {
        await ensureTables();

        const { email, password, name, shopName } = req.body || {};
        if (!email || !password || !name || !shopName) {
            return respond(context, 400, { error: 'All fields required: email, password, name, shopName' });
        }

        const usersTable = getTable('Users');

        // Check if email already exists
        let emailExists = false;
        for await (const _ of usersTable.listEntities({
            queryOptions: { filter: `email eq '${email}'` }
        })) {
            emailExists = true;
            break;
        }
        if (emailExists) return respond(context, 400, { error: 'Email already registered' });

        // Create shop first so we have the shopId
        const shopId = uuidv4();
        const userId = uuidv4();
        const orgCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const shopsTable = getTable('Shops');
        await shopsTable.createEntity({
            partitionKey: 'shops',
            rowKey: shopId,
            name: shopName,
            managerId: userId,
            orgCode,
            createdAt: new Date().toISOString()
        });

        // Create admin user
        const passwordHash = await bcrypt.hash(password, 10);
        await usersTable.createEntity({
            partitionKey: 'users',
            rowKey: userId,
            email,
            name,
            role: 'admin',
            passwordHash,
            organizationId: shopId,
            createdAt: new Date().toISOString()
        });

        const token = signToken({ id: userId, email, role: 'admin', organizationId: shopId });

        return respond(context, 201, {
            token,
            user: {
                id: userId,
                email,
                name,
                role: 'admin',
                organization: { id: shopId, name: shopName }
            }
        });

    } catch (err) {
        context.log.error('Signup error:', err);
        return respond(context, 500, { error: 'Signup failed' });
    }
};
