const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');

const Mutations = {
	async createItem(parent, args, ctx, info) {
        // TODO: Check if they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to do that!')
        }
		const item = await ctx.db.mutation.createItem(
			{
				data: {
                    ...args,
                    // This is how we create relationships between the data and user
                    user: {
                        connection: {
                            id: ctx.request.userId
                        }
                    }
				}
				// The info variables holds the query
			},
			info
		);
		return item;
	},
	async updateItem(parent, args, ctx, info) {
		// Make copy of updates
		const updates = { ...args };
		// Remove ID from update
		delete updates.id;

		const item = await ctx.db.mutation.updateItem(
			{
				data: {
					...updates
				},
				where: {
					id: args.id
				}
			},
			info
		);
		return item;
	},
	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id };
		// 1. Find the item
		const item = await ctx.db.query.item({ where }, `{id, title}`);
		// 2.  TODO: Check if they own the item, or have the permissions

		// 3. Delete it!
		return ctx.db.mutation.deleteItem({ where }, info);
	},
	async signUp(parent, args, ctx, info) {
		// Lowercase email
		args.email = args.email.toLowerCase();
		// Hash password
		const password = await bcrypt.hash(args.password, 10);
		// Create the user in the database
		const user = await ctx.db.mutation.createUser(
			{
				data: {
					...args,
					password: password,
					permissions: { set: [ 'USER' ] }
				}
			},
			info
		);
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// Set the jwt as a cookie as a response
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
		});

		return user;
	},
	async signIn(parent, { email, password }, ctx, info) {
		// Check if there is a user with that email
		const user = await ctx.db.query.user({ where: { email } });
		if (!user) {
			throw new Error(`No such user found for email ${email}`);
		}
		// Check if password is correct
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Invalid Password!');
		}
		// Generate JWT token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// Set the cookie with the token
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
		});
		// Return the User
		return user;
	},
	async signOut(parent, args, ctx, info) {
		ctx.response.clearCookie('token');
		return { message: 'Goodbye!' };
	},
	async requestReset(parent, args, ctx, info) {
		// 1. Check if this is a real user
		const user = await ctx.db.query.user({ where: { email: args.email } });
		if (!user) {
			throw new Error(`No such user found for email ${args.email}`);
		}
		// 2. Set a reset token and expiry on that user
		const randomBytesPromisified = promisify(randomBytes);
		const resetToken = (await randomBytesPromisified(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
		const res = await ctx.db.mutation.updateUser({
			where: { email: args.email },
			data: { resetToken, resetTokenExpiry }
		});
		// 3. Email them a reset token
		const mailRes = await transport.sendMail({
			from: 'juan@masterycoding.com',
			to: user.email,
			subject: 'Your Password Reset Token',
			html: makeANiceEmail(
				`Your password token is here! \n\n <a href="${process.env
					.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`
			)
		});
		return { message: 'Thanks!@' };
	},
	async resetPassword(parent, args, ctx, info) {
		// 1. Check if the passwords match
		if (args.password !== args.confirmPassword) {
			throw new Error("Yo Passwords don't match");
		}
		// 2. Check if its a legit reset token
		// 3. Check if it is expired
		const [ user ] = await ctx.db.query.users({
			where: {
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 3600000
			}
		});
		// 4. Hash their new password
		const password = await bcrypt.hash(args.password, 10);
		// 5. Save the new password to the user and remove old resettoken fields
		const updatedUser = await ctx.db.mutation.updateUser({
			where: { email: user.email },
			data: {
				password,
				resetToken: null,
				resetTokenExpiry: null
			}
		});

		// 6. Generate JWT
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
		// 7. Set the JWT cookie
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		});
		// 8. Return the new user
		return updatedUser;
	},
	// async assignUserToAllItems(parent, args, ctx, info) {
	// 	let items = await ctx.db.query.items({});
	// 	items = await Promise.all( 
	// 		items.map(({id}) => {
    //             return ctx.db.mutation.updateItem(
    //                 {
    //                     where: {
    //                         id: id
    //                     },
    //                     data: {
    //                         user: {
    //                             connect: {
    //                                 id: args.id
    //                             }
    //                         }
    //                     }
    //                 },
    //                 info
    //             );
    //         })
	// 	);
	// 	items = items || [];
	// 	return items;
	// }
};

module.exports = Mutations;
