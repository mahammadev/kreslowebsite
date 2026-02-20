import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductForm } from '@/components/admin/ProductForm';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: productsData } = await supabase
    .from('products')
    .select('*, category:categories(name_az)')
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name_az')
    .eq('is_active', true)
    .order('sort_order');

  const products = productsData as any[];
  const categories = categoriesData as any[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <ProductForm mode="create" categories={categories || []} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={product.image_url}
                      alt={product.name_az}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {product.name_az}
                  {product.discount_price && (
                    <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">
                      Sale
                    </span>
                  )}
                </TableCell>
                <TableCell>{(product.category as any)?.name_az || '-'}</TableCell>
                <TableCell>
                  {product.discount_price ? (
                    <div className="flex flex-col">
                      <span className="text-red-600 font-bold">{product.discount_price}</span>
                      <span className="text-muted-foreground line-through text-xs">{product.price}</span>
                    </div>
                  ) : (
                    <span>{product.price}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {product.is_active ? (
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500" title="Active" />
                    ) : (
                      <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" title="Inactive" />
                    )}
                    {product.in_stock ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500">Out of Stock</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ProductForm mode="edit" product={product} categories={categories || []} />
                </TableCell>
              </TableRow>
            ))}
            {!products?.length && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
