
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';

export default function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      await seedProducts();
      toast({
        title: 'Database Seeded',
        description: 'Products have been successfully seeded into Firestore.',
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: 'Error Seeding Database',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeedDatabase} disabled={isLoading} variant="outline" className="my-4">
      <Database className="mr-2 h-4 w-4" />
      {isLoading ? 'Seeding...' : 'Seed Database with Products'}
    </Button>
  );
}
