import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from '@/server/schema'

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantsWithImagesTags = InferResultType<'productVariants', { variantImages: true, variantTags: true }>
export type ProductsWithVariants = InferResultType<'products', { productVariants: true }>
export type VariantsWithProductImagesTags = InferResultType<'productVariants', { product: true, variantImages: true, variantTags: true }>
export type TotalOrders = InferResultType<'orderItem', { order: { with: { user: true } }, product: true, productVariant: { with: { variantImages: true }}}>