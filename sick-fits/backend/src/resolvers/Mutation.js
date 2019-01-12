const Mutations = {
	async createItem(parent, args, ctx, info) {
		// TODO: Check if they are logged in
		const item = await ctx.db.mutation.createItem({ 
            data: {
                ...args
            } 
            // The info variables holds the query
        }, info)
        return item;
    },
    async updateItem(parent, args, ctx, info) {
        // Make copy of updates
        const updates = { ...args };
        // Remove ID from update
        delete updates.id;

        const item = await ctx.db.mutation.updateItem({
            data: {
                ...updates
            },
            where: {
                id: args.id
            }
        }, info)
        return item;
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id }
        // 1. Find the item
        const item = await ctx.db.query.item({where}, `{id, title}`);
        // 2.  TODO: Check if they own the item, or have the permissions

        // 3. Delete it!
        return ctx.db.mutation.deleteItem({where}, info);
    }
};

module.exports = Mutations;