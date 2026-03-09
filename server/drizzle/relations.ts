import { relations } from "drizzle-orm/relations";
import { products, productVariants, variantImages, variantTags, orderItem, orders, user, invoices, account } from "./schema";

export const productVariantsRelations = relations(productVariants, ({one, many}) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id]
	}),
	variantImages: many(variantImages),
	variantTags: many(variantTags),
	orderItems: many(orderItem),
}));

export const productsRelations = relations(products, ({many}) => ({
	productVariants: many(productVariants),
	orderItems: many(orderItem),
}));

export const variantImagesRelations = relations(variantImages, ({one}) => ({
	productVariant: one(productVariants, {
		fields: [variantImages.variantId],
		references: [productVariants.id]
	}),
}));

export const variantTagsRelations = relations(variantTags, ({one}) => ({
	productVariant: one(productVariants, {
		fields: [variantTags.variantId],
		references: [productVariants.id]
	}),
}));

export const orderItemRelations = relations(orderItem, ({one}) => ({
	productVariant: one(productVariants, {
		fields: [orderItem.productVariantId],
		references: [productVariants.id]
	}),
	product: one(products, {
		fields: [orderItem.productId],
		references: [products.id]
	}),
	order: one(orders, {
		fields: [orderItem.orderId],
		references: [orders.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	orderItems: many(orderItem),
	user: one(user, {
		fields: [orders.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	orders: many(orders),
	invoices: many(invoices),
	accounts: many(account),
}));

export const invoicesRelations = relations(invoices, ({one}) => ({
	user: one(user, {
		fields: [invoices.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));