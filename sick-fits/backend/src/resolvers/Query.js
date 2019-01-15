const { forwardTo } = require('prisma-binding');
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
    }
};

module.exports = Query;