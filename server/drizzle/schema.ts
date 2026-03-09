import { pgTable, unique, text, timestamp, boolean, serial, real, foreignKey, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const roles = pgEnum("roles", ['user', 'admin'])

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	roles: roles("roles").default('user'),
	twoFactorEnabled: boolean("twoFactorEnabled").default(false),
	password: text("password"),
	customerId: text("customerID"),
},
(table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const products = pgTable("products", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	price: real("price").notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow(),
});

export const productVariants = pgTable("productVariants", {
	id: serial("id").primaryKey().notNull(),
	productId: serial("productID").notNull(),
	color: text("color").notNull(),
	variantName: text("variantName").notNull(),
	updated: timestamp("updated", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		productVariantsProductIdProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "productVariants_productID_products_id_fk"
		}).onDelete("cascade"),
	}
});

export const variantImages = pgTable("variantImages", {
	id: serial("id").primaryKey().notNull(),
	variantId: serial("variantID").notNull(),
	url: text("url").notNull(),
	size: real("size").notNull(),
	name: text("name").notNull(),
	number: real("number").notNull(),
},
(table) => {
	return {
		variantImagesVariantIdProductVariantsIdFk: foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "variantImages_variantID_productVariants_id_fk"
		}).onDelete("cascade"),
	}
});

export const variantTags = pgTable("variantTags", {
	id: serial("id").primaryKey().notNull(),
	variantId: serial("variantID").notNull(),
	tag: text("tag").notNull(),
},
(table) => {
	return {
		variantTagsVariantIdProductVariantsIdFk: foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "variantTags_variantID_productVariants_id_fk"
		}).onDelete("cascade"),
	}
});

export const orderItem = pgTable("orderItem", {
	id: serial("id").primaryKey().notNull(),
	productId: serial("productID").notNull(),
	productVariantId: serial("productVariantID").notNull(),
	quantity: integer("quantity").notNull(),
	orderId: serial("orderID").notNull(),
},
(table) => {
	return {
		orderItemProductVariantIdProductVariantsIdFk: foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariants.id],
			name: "orderItem_productVariantID_productVariants_id_fk"
		}).onDelete("cascade"),
		orderItemProductIdProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "orderItem_productID_products_id_fk"
		}).onDelete("cascade"),
		orderItemOrderIdOrdersIdFk: foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "orderItem_orderID_orders_id_fk"
		}).onDelete("cascade"),
	}
});

export const orders = pgTable("orders", {
	id: serial("id").primaryKey().notNull(),
	userId: text("userID").notNull(),
	total: real("total").notNull(),
	status: text("status").notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow(),
	receiptUrl: text("receiptURL"),
	paymentIntentId: text("paymentIntentID"),
	pickupLocation: text("pickupLocation"),
},
(table) => {
	return {
		ordersUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "orders_userID_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const invoices = pgTable("invoices", {
	id: serial("id").primaryKey().notNull(),
	userId: text("userID").notNull(),
	total: real("total").notNull(),
	status: text("status").notNull(),
	description: text("description").notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow(),
	receiptUrl: text("receiptURL"),
	paymentIntentId: text("paymentIntentID"),
	updated: timestamp("updated", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		invoicesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "invoices_userID_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const emailTokens = pgTable("email_tokens", {
	id: text("id").notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		emailTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "email_tokens_id_token_pk"}),
	}
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
	id: text("id").notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		twoFactorTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "two_factor_tokens_id_token_pk"}),
	}
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: text("id").notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		passwordResetTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "password_reset_tokens_id_token_pk"}),
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull(),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});