import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Zap, FolderTree } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: activeProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: flashSales } = await supabase
    .from('active_flash_sales')
    .select('*', { count: 'exact', head: true });

  const { count: activeCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { data: recentProductsData } = await supabase
    .from('products')
    .select('id, name_az, updated_at, price')
    .order('updated_at', { ascending: false })
    .limit(5);

  const recentProducts = recentProductsData as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flash Sales</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flashSales ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCategories ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentProducts?.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name_az}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated at {new Date(product.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {product.price} AZN
                  </div>
                </div>
              ))}
              {!recentProducts?.length && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
