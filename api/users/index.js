const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { getTable } = require('../lib/db');
const { verifyToken, corsHeaders, respond } = require('../lib/auth');

module.exports = async function (context, req) {
    context.res = { headers: corsHeaders };
    if (req.method === 'OPTIONS') return;

    const user = verifyToken(req);
    if (!user) return respond(context, 401, { error: 'Unauthorized' });

    const usersTable = getTable('Users');
    const orgId = user.organizationId;

    try {
        // GET — list all employees in this org
        if (req.method === 'GET') {
            const users = [];
            for await (const u of usersTable.listEntities({
                queryOptions: { filter: `organizationId eq '${orgId}'` }
            })) {
                if (u.rowKey === user.id) continue; // exclude self
                users.push({
                    id: u.rowKey,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    userCode: u.userCode,
                    createdAt: u.createdAt
                });
            }
            return respond(context, 200, users);
        }

        // POST — add new employee
        if (req.method === 'POST') {
            const { email, password, name, role } = req.body || {};
            if (!email || !password || !name) {
                return respond(context, 400, { error: 'email, password, and name are required' });
            }

            // Check email not already used
            let emailExists = false;
            for await (const _ of usersTable.listEntities({
                queryOptions: { filter: `email eq '${email}'` }
            })) {
                emailExists = true;
                break;
            }
            if (emailExists) return respond(context, 400, { error: 'Email already in use' });

            const userId = uuidv4();
            const userCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const passwordHash = await bcrypt.hash(password, 10);

            await usersTable.createEntity({
                partitionKey: 'users',
                rowKey: userId,
                email,
                name,
                role: role || 'staff',
                passwordHash,
                organizationId: orgId,
                userCode,
                createdAt: new Date().toISOString()
            });

            return respond(context, 201, { id: userId, email, name, role: role || 'staff', userCode });
        }

        // DELETE — remove an employee
        if (req.method === 'DELETE') {
            const userId = req.query.id;
            if (!userId) return respond(context, 400, { error: 'User ID required' });
            await usersTable.deleteEntity('users', userId);
            return respond(context, 200, { success: true });
        }

        return respond(context, 405, { error: 'Method not allowed' });

    } catch (err) {
        context.log.error('Users error:', err);
        return respond(context, 500, { error: 'Operation failed' });
    }
};
