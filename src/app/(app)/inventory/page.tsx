
'use client';

import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  FilePenLine,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type InventoryItem = {
    id: string;
    name: string;
    batch: string;
    expiry: string;
    price: number;
    stock: number;
    pillsPerStrip?: number;
    stripPrice?: number;
    isPillBased?: boolean;
}

type FormData = {
    name: string;
    batch: string;
    expiry: string;
    price: string;
    stock: string;
    pillsPerStrip: string;
    stripPrice: string;
    isPillBased: boolean;
}

const LOW_STOCK_THRESHOLD = 25;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    batch: '',
    expiry: '',
    price: '',
    stock: '',
    pillsPerStrip: '',
    stripPrice: '',
    isPillBased: false
  });
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
        toast({
            title: 'Error',
            description: 'Failed to load inventory.',
            variant: 'destructive'
        });
      }
    }
    fetchInventory();
  }, [toast]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'isPillBased') {
      setFormData(prev => ({
        ...prev,
        [field]: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.batch || !formData.expiry || !formData.price || !formData.stock) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          batch: formData.batch,
          expiry: formData.expiry,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          isPillBased: formData.isPillBased,
          pillsPerStrip: formData.isPillBased ? parseInt(formData.pillsPerStrip) : undefined,
          stripPrice: formData.isPillBased ? parseFloat(formData.stripPrice) : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add medicine');
      }

      const newItem = await response.json();
      setInventory(prev => [...prev, newItem]);
      
      // Reset form
      setFormData({
        name: '',
        batch: '',
        expiry: '',
        price: '',
        stock: '',
        pillsPerStrip: '',
        stripPrice: '',
        isPillBased: false
      });
      
      setIsSheetOpen(false);
      toast({
        title: 'Success',
        description: 'Medicine added successfully.',
      });
    } catch (error) {
      console.error('Failed to add medicine:', error);
      toast({
        title: 'Error',
        description: 'Failed to add medicine.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      batch: item.batch,
      expiry: item.expiry,
      price: item.price.toString(),
      stock: item.stock.toString(),
      pillsPerStrip: item.pillsPerStrip?.toString() || '',
      stripPrice: item.stripPrice?.toString() || '',
      isPillBased: item.isPillBased || false
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData.name || !formData.batch || !formData.expiry || !formData.price || !formData.stock) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          batch: formData.batch,
          expiry: formData.expiry,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          isPillBased: formData.isPillBased,
          pillsPerStrip: formData.isPillBased ? parseInt(formData.pillsPerStrip) : undefined,
          stripPrice: formData.isPillBased ? parseFloat(formData.stripPrice) : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update medicine');
      }

      // Update the item in the local state
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              name: formData.name, 
              batch: formData.batch, 
              expiry: formData.expiry, 
              price: parseFloat(formData.price), 
              stock: parseInt(formData.stock),
              isPillBased: formData.isPillBased,
              pillsPerStrip: formData.isPillBased ? parseInt(formData.pillsPerStrip) : undefined,
              stripPrice: formData.isPillBased ? parseFloat(formData.stripPrice) : undefined
            }
          : item
      ));
      
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({
        title: 'Success',
        description: 'Medicine updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update medicine:', error);
      toast({
        title: 'Error',
        description: 'Failed to update medicine.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }

      setInventory(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Medicine deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete medicine.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
        <div className="ml-auto flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Medicine
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Medicine</SheetTitle>
                <SheetDescription>
                  Fill in the details for the new medicine.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Paracetamol 500mg" 
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batch" className="text-right">
                    Batch No.
                  </Label>
                  <Input 
                    id="batch" 
                    placeholder="e.g. B12345" 
                    className="col-span-3"
                    value={formData.batch}
                    onChange={(e) => handleInputChange('batch', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry" className="text-right">
                    Expiry Date
                  </Label>
                  <Input 
                    id="expiry" 
                    type="date" 
                    className="col-span-3"
                    value={formData.expiry}
                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price (₨)
                  </Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="9.99" 
                    className="col-span-3"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="100" 
                    className="col-span-3"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                  />
                </div>
                
                {/* Pill/Strip Configuration */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    <input
                      type="checkbox"
                      checked={formData.isPillBased}
                      onChange={(e) => handleInputChange('isPillBased', e.target.checked.toString())}
                      className="mr-2"
                    />
                    Pill-based Medicine
                  </Label>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    Enable if this medicine is sold by individual pills from strips
                  </div>
                </div>
                
                {formData.isPillBased && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pillsPerStrip" className="text-right">
                        Pills per Strip
                      </Label>
                      <Input 
                        id="pillsPerStrip" 
                        type="number" 
                        placeholder="10" 
                        className="col-span-3"
                        value={formData.pillsPerStrip}
                        onChange={(e) => handleInputChange('pillsPerStrip', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stripPrice" className="text-right">
                        Strip Price (₨)
                      </Label>
                      <Input 
                        id="stripPrice" 
                        type="number" 
                        placeholder="100" 
                        className="col-span-3"
                        value={formData.stripPrice}
                        onChange={(e) => handleInputChange('stripPrice', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Medicine'}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Medicine Stock</CardTitle>
          <CardDescription>
            Manage your medicine inventory and view stock levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Batch No.</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.batch}</TableCell>
                  <TableCell>{item.expiry}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    {item.isPillBased ? (
                      <div className="text-xs">
                        <div className="font-medium">Pill-based</div>
                        <div className="text-muted-foreground">
                          {item.pillsPerStrip} pills/₨{item.stripPrice}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Regular</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.stock < LOW_STOCK_THRESHOLD ? 'destructive' : 'default'}>
                      {item.stock < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₨{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <FilePenLine className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{inventory.length}</strong> of <strong>{inventory.length}</strong> products
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>
              Update the medicine details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input 
                id="edit-name" 
                placeholder="e.g. Paracetamol 500mg" 
                className="col-span-3"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-batch" className="text-right">
                Batch No.
              </Label>
              <Input 
                id="edit-batch" 
                placeholder="e.g. B12345" 
                className="col-span-3"
                value={formData.batch}
                onChange={(e) => handleInputChange('batch', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-expiry" className="text-right">
                Expiry Date
              </Label>
              <Input 
                id="edit-expiry" 
                type="date" 
                className="col-span-3"
                value={formData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price (₨)
              </Label>
              <Input 
                id="edit-price" 
                type="number" 
                placeholder="9.99" 
                className="col-span-3"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">
                Stock
              </Label>
              <Input 
                id="edit-stock" 
                type="number" 
                placeholder="100" 
                className="col-span-3"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Medicine'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    