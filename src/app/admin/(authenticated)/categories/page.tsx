import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('category_tree')
    .select('*')
    .order('sort_order', { ascending: true });

  const categories = data as Database['public']['Views']['category_tree']['Row'][] | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <CategoryForm mode="create" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name (AZ)</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name_az}</TableCell>
                <TableCell>{category.parent_name_az || '-'}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.sort_order}</TableCell>
                <TableCell className="text-right">
                  <CategoryForm mode="edit" category={category} />
                </TableCell>
              </TableRow>
            ))}
            {!categories?.length && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
