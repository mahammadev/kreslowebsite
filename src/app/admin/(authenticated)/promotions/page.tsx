import { createClient } from '@/lib/supabase/server';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BundleForm } from '@/components/admin/BundleForm';

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
    const supabase = await createClient();

    const { data: flashSalesData } = await supabase
        .from('active_flash_sales')
        .select('id, name_az, price, discount_price, discount_ends_at')
        .order('discount_price', { ascending: true });

    const { data: bundlesData } = await supabase
        .from('bundles')
        .select(`
            *,
            products:bundle_items(
                product_id,
                products(id, name_az, price, image_url)
            )
        `)
        .order('created_at', { ascending: false });

    const { data: allProducts } = await supabase
        .from('products')
        .select('id, name_az, price, image_url')
        .eq('is_active', true)
        .order('name_az');

    const flashSales = flashSalesData || [];
    const bundles = bundlesData || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Promotions & Bundles</h1>
            </div>

            {/* Active Flash Sales */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Active Flash Sales</h2>
                    <Button asChild variant="outline">
                        <Link href="/admin/products">Manage Discounts in Products</Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card text-card-foreground">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Original Price (AZN)</TableHead>
                                <TableHead>Discount Price (AZN)</TableHead>
                                <TableHead>Ends At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flashSales?.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.name_az}</TableCell>
                                    <TableCell className="line-through text-muted-foreground">{sale.price}</TableCell>
                                    <TableCell className="text-red-500 font-bold">{sale.discount_price}</TableCell>
                                    <TableCell>
                                        {sale.discount_ends_at
                                            ? new Date(sale.discount_ends_at).toLocaleDateString()
                                            : <Badge variant="secondary">No End Date</Badge>}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!flashSales?.length && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No active flash sales found. Create one by adding a discount price to a product.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Bundles */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Bundles (Packages)</h2>
                    <BundleForm mode="create" allProducts={allProducts || []} />
                </div>

                <div className="rounded-md border bg-card text-card-foreground">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bundle Name</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Discount %</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bundles?.map((bundle) => {
                                const products = bundle.products?.map((p: any) => p.products).filter(Boolean) || [];
                                return (
                                    <TableRow key={bundle.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                {bundle.name_az}
                                                <p className="text-xs text-muted-foreground mt-1">{bundle.slug}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {products.slice(0, 3).map((p: any) => (
                                                    <Badge key={p.id} variant="outline" className="text-xs">
                                                        {p.name_az}
                                                    </Badge>
                                                ))}
                                                {products.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{products.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-green-600 font-bold">{bundle.discount_percentage}%</span>
                                        </TableCell>
                                        <TableCell>
                                            {bundle.is_active ?
                                                <Badge variant="default" className="bg-green-500">Active</Badge>
                                                : <Badge variant="secondary">Inactive</Badge>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <BundleForm
                                                mode="edit"
                                                bundle={{
                                                    ...bundle,
                                                    product_ids: products.map((p: any) => p.id),
                                                    products: bundle.products,
                                                }}
                                                allProducts={allProducts || []}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!bundles?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No bundles created yet. Click "Create Bundle" to make your first package deal.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
