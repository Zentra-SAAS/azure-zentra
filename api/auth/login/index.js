const bcrypt = require('bcryptjs');
const { getTable } = require('../../lib/db');
const { signToken, corsHeaders, respond } = require('../../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return respond(context, 400, { error: 'Email and password required' });
        }

        // Find user by email (scan all users — acceptable for small scale)
        const usersTable = getTable('Users');
        let foundUser = null;
        for await (const user of usersTable.listEntities({
            queryOptions: { filter: `email eq '${email}'` }
        })) {
            foundUser = user;
            break;
        }

        if (!foundUser) return respond(context, 401, { error: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, foundUser.passwordHash);
        if (!valid) return respond(context, 401, { error: 'Invalid email or password' });

        // Get the shop/org name
        let orgName = '';
        if (foundUser.organizationId) {
            try {
                const shopsTable = getTable('Shops');
                const shop = await shopsTable.getEntity('shops', foundUser.organizationId);
                orgName = shop.name;
            } catch (_) { /* org might not exist */ }
        }

        const token = signToken({
            id: foundUser.rowKey,
            email: foundUser.email,
            role: foundUser.role,
            organizationId: foundUser.organizationId
        });

        return respond(context, 200, {
            token,
            user: {
                id: foundUser.rowKey,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role,
                organization: {
                    id: foundUser.organizationId,
                    name: orgName
                }
            }
        });

    } catch (err) {
        context.log.error('Login error:', err);
        return respond(context, 500, { error: 'Login failed' });
    }
};
