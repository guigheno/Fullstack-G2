module.exports = {
  users: require('./user.routes'),
  brands: require('./brand.routes'),
  categories: require('./category.routes'),
  productsV2: require('./product.routes.v2'),
  customers: require('./customer.routes'),
  addresses: require('./address.routes'),
  orders: require('./order.routes'),
  auth: require('./auth.routes'),
  cartMe: require('./cart.me.routes'),
  addressesMe: require('./addresses.me.routes'),
  ordersMe: require('./orders.me.routes'),
  suppliers: require('./suppliers'),
  dashboard: require('./dashboard') 
};