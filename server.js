const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { TableClient, TableServiceClient } = require('@azure/data-tables');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zentra-dev-secret';
const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const getTable = (name) => TableClient.fromConnectionString(CONN, name);

async function ensureTables() {
    const svc = TableServiceClient.fromConnectionString(CONN);
    for (const t of ['Shops', 'Users', 'Products', 'Bills', 'BillItems']) {
        try { await svc.createTable(t); } catch (e) { if (e.statusCode !== 409) throw e; }
    }
}

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

function auth(req, res, next) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try { req.user = jwt.verify(token, JWT_SECRET); next(); }
    catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
    try {
        await ensureTables();
        const { email, password, name, shopName } = req.body || {};
        if (!email || !password || !name || !shopName)
            return res.status(400).json({ error: 'All fields required' });

        const usersTable = getTable('Users');
        for await (const _ of usersTable.listEntities({ queryOptions: { filter: `email eq '${email}'` } }))
            return res.status(400).json({ error: 'Email already registered' });

        const passkey = Math.random().toString(36).substring(2, 8).toUpperCase();
        await getTable('Shops').createEntity({ partitionKey: 'shops', rowKey: shopId, name: shopName, managerId: userId, orgCode, passkey, createdAt: new Date().toISOString() });

        const passwordHash = await bcrypt.hash(password, 10);
        await usersTable.createEntity({ partitionKey: 'users', rowKey: userId, email, name, role: 'admin', passwordHash, organizationId: shopId, createdAt: new Date().toISOString() });

        const token = signToken({ id: userId, email, role: 'admin', organizationId: shopId });
        res.status(201).json({ 
            token, 
            user: { 
                id: userId, 
                email, 
                name, 
                role: 'admin', 
                organization: { 
                    id: shopId, 
                    name: shopName, 
                    org_code: orgCode, 
                    passkey, 
                    created_at: new Date().toISOString() 
                } 
            } 
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Signup failed' }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        let found = null;
        for await (const u of getTable('Users').listEntities({ queryOptions: { filter: `email eq '${email}'` } }))
            { found = u; break; }
        if (!found || !await bcrypt.compare(password, found.passwordHash))
            return res.status(401).json({ error: 'Invalid credentials' });

        let org = { id: found.organizationId, name: '' };
        try { 
            const s = await getTable('Shops').getEntity('shops', found.organizationId); 
            org = { 
                id: found.organizationId, 
                name: s.name, 
                org_code: s.orgCode, 
                passkey: s.passkey, 
                created_at: s.createdAt 
            }; 
        } catch {}

        const token = signToken({ id: found.rowKey, email: found.email, role: found.role, organizationId: found.organizationId });
        res.json({ token, user: { id: found.rowKey, email: found.email, name: found.name, role: found.role, organization: org } });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Login failed' }); }
});

// ── SHOPS ────────────────────────────────────────────────────────────────────
app.get('/api/shops', auth, async (req, res) => {
    const rows = [];
    for await (const s of getTable('Shops').listEntities({ queryOptions: { filter: `managerId eq '${req.user.id}'` } }))
        rows.push({ id: s.rowKey, name: s.name, orgCode: s.orgCode, createdAt: s.createdAt });
    res.json(rows);
});
app.post('/api/shops', auth, async (req, res) => {
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name required' });
    const shopId = uuidv4(), orgCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await getTable('Shops').createEntity({ partitionKey: 'shops', rowKey: shopId, name, managerId: req.user.id, orgCode, createdAt: new Date().toISOString() });
    res.status(201).json({ id: shopId, name, orgCode });
});
app.delete('/api/shops', auth, async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID required' });
    await getTable('Shops').deleteEntity('shops', id);
    res.json({ success: true });
});

// ── USERS ────────────────────────────────────────────────────────────────────
app.get('/api/users', auth, async (req, res) => {
    const rows = [];
    for await (const u of getTable('Users').listEntities({ queryOptions: { filter: `organizationId eq '${req.user.organizationId}'` } }))
        if (u.rowKey !== req.user.id) rows.push({ id: u.rowKey, email: u.email, name: u.name, role: u.role, userCode: u.userCode, createdAt: u.createdAt });
    res.json(rows);
});
app.post('/api/users', auth, async (req, res) => {
    const { email, password, name, role } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: 'Fields required' });
    const userId = uuidv4(), userCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const passwordHash = await bcrypt.hash(password, 10);
    await getTable('Users').createEntity({ partitionKey: 'users', rowKey: userId, email, name, role: role || 'staff', passwordHash, organizationId: req.user.organizationId, userCode, createdAt: new Date().toISOString() });
    res.status(201).json({ id: userId, email, name, role: role || 'staff', userCode });
});
app.delete('/api/users', auth, async (req, res) => {
    await getTable('Users').deleteEntity('users', req.query.id);
    res.json({ success: true });
});

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get('/api/products', auth, async (req, res) => {
    const shopId = req.query.shopId || req.user.organizationId;
    const rows = [];
    for await (const p of getTable('Products').listEntities({ queryOptions: { filter: `PartitionKey eq '${shopId}'` } }))
        rows.push({ id: p.rowKey, name: p.name, description: p.description, price: parseFloat(p.price||0), cost_price: parseFloat(p.costPrice||0), sku: p.sku, stock_quantity: parseInt(p.stockQuantity||0), low_stock_threshold: parseInt(p.lowStockThreshold||10), category: p.category, createdAt: p.createdAt });
    res.json(rows);
});
app.post('/api/products', auth, async (req, res) => {
    const { name, description, price, cost_price, sku, stock_quantity, low_stock_threshold, category } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name required' });
    const id = uuidv4(), shopId = req.user.organizationId;
    await getTable('Products').createEntity({ partitionKey: shopId, rowKey: id, name, description: description||'', price: String(price||0), costPrice: String(cost_price||0), sku: sku||'', stockQuantity: String(stock_quantity||0), lowStockThreshold: String(low_stock_threshold||10), category: category||'', createdAt: new Date().toISOString() });
    res.status(201).json({ id, name });
});
app.put('/api/products', auth, async (req, res) => {
    const { id, name, description, price, cost_price, sku, stock_quantity, low_stock_threshold, category } = req.body || {};
    if (!id) return res.status(400).json({ error: 'ID required' });
    const shopId = req.user.organizationId;
    await getTable('Products').updateEntity({ partitionKey: shopId, rowKey: id, name, description: description||'', price: String(price||0), costPrice: String(cost_price||0), sku: sku||'', stockQuantity: String(stock_quantity||0), lowStockThreshold: String(low_stock_threshold||10), category: category||'' }, 'Merge');
    res.json({ success: true });
});
app.delete('/api/products', auth, async (req, res) => {
    await getTable('Products').deleteEntity(req.user.organizationId, req.query.id);
    res.json({ success: true });
});

// ── BILLS ────────────────────────────────────────────────────────────────────
app.get('/api/bills', auth, async (req, res) => {
    const rows = [];
    for await (const b of getTable('Bills').listEntities({ queryOptions: { filter: `PartitionKey eq '${req.user.organizationId}'` } }))
        rows.push({ id: b.rowKey, total_amount: parseFloat(b.totalAmount||0), payment_method: b.paymentMethod, status: b.status, createdAt: b.createdAt });
    res.json(rows);
});
app.post('/api/bills', auth, async (req, res) => {
    const { items, total_amount, payment_method, customer_name } = req.body || {};
    if (!items?.length) return res.status(400).json({ error: 'Items required' });
    const shopId = req.user.organizationId, billId = uuidv4();
    await getTable('Bills').createEntity({ partitionKey: shopId, rowKey: billId, cashierId: req.user.id, customerName: customer_name||'', totalAmount: String(total_amount||0), paymentMethod: payment_method||'cash', status: 'completed', createdAt: new Date().toISOString() });
    for (const item of items) {
        await getTable('BillItems').createEntity({ partitionKey: billId, rowKey: uuidv4(), productId: item.product_id, quantity: String(item.quantity), priceAtSale: String(item.price_at_sale), subtotal: String((item.quantity * item.price_at_sale).toFixed(2)) });
        try {
            const p = await getTable('Products').getEntity(shopId, item.product_id);
            await getTable('Products').updateEntity({ partitionKey: shopId, rowKey: item.product_id, stockQuantity: String(Math.max(0, parseInt(p.stockQuantity||0) - item.quantity)) }, 'Merge');
        } catch {}
    }
    res.status(201).json({ id: billId, status: 'completed' });
});

// ── ANALYTICS ────────────────────────────────────────────────────────────────
app.get('/api/analytics', auth, async (req, res) => {
    const shopId = req.query.shopId || req.user.organizationId;
    let totalRevenue = 0, totalBills = 0;
    const dailyMap = new Map(), allBills = [], productNameMap = new Map(), productSales = new Map();

    for await (const b of getTable('Bills').listEntities({ queryOptions: { filter: `PartitionKey eq '${shopId}'` } })) {
        const amt = parseFloat(b.totalAmount||0);
        totalRevenue += amt; totalBills++;
        allBills.push(b);
        const day = (b.createdAt||'').substring(0,10);
        dailyMap.set(day, (dailyMap.get(day)||0) + amt);
    }
    const salesTrend = Array.from(dailyMap.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([date,revenue])=>({ date, revenue: revenue.toFixed(2) }));

    const lowStockProducts = [];
    for await (const p of getTable('Products').listEntities({ queryOptions: { filter: `PartitionKey eq '${shopId}'` } })) {
        productNameMap.set(p.rowKey, p.name);
        if (parseInt(p.stockQuantity||0) <= parseInt(p.lowStockThreshold||10))
            lowStockProducts.push({ name: p.name, stock_quantity: parseInt(p.stockQuantity||0) });
    }

    let totalEmployees = 0;
    for await (const _ of getTable('Users').listEntities({ queryOptions: { filter: `organizationId eq '${shopId}'` } })) totalEmployees++;

    for (const bill of allBills)
        for await (const item of getTable('BillItems').listEntities({ queryOptions: { filter: `PartitionKey eq '${bill.rowKey}'` } })) {
            const e = productSales.get(item.productId) || { name: productNameMap.get(item.productId)||item.productId, units:0, revenue:0 };
            e.units += parseFloat(item.quantity||0); e.revenue += parseFloat(item.subtotal||0);
            productSales.set(item.productId, e);
        }

    const topProducts = Array.from(productSales.values()).sort((a,b)=>b.revenue-a.revenue).slice(0,5).map(p=>({ name:p.name, units_sold:p.units.toString(), revenue:p.revenue.toFixed(2) }));

    res.json({ sales:{ total_revenue: totalRevenue.toFixed(2), total_bills: String(totalBills) }, sales_trend: salesTrend, low_stock_products: lowStockProducts, total_employees: totalEmployees, top_products: topProducts });
});

// ── Serve React Frontend ──────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`Zentra server running on port ${PORT}`));
