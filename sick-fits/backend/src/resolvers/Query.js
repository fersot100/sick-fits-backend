const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // Check if theere is a current user ID
        // Return null
        if (!ctx.request.userId) return null;
        // Returning a promise
        return ctx.db.query.user({
            where: {id: ctx.request.userId},
        }, info);
    },
    async users(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }
        // 1. Check if the user has the permissions to query all users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
        // 2. If they do, query all the users
        return ctx.db.query.users({}, info);
    }
};

module.exports = Query;