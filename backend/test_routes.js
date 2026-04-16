const app = require('./src/app');
const adminLayer = app._router.stack.find(l => l.regexp.toString().includes('admin/orders'));
if (adminLayer && adminLayer.handle.stack) {
  const adminRoutes = adminLayer.handle.stack.map(l => ({ path: l.route?.path, methods: Object.keys(l.route?.methods || {}) }));
  console.log(JSON.stringify(adminRoutes, null, 2));
} else {
  console.log("No admin layer found");
}
