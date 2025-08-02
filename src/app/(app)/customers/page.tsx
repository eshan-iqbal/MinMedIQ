'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  FilePenLine,
  MoreHorizontal,
  PlusCircle,
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
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';

type Customer = {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    address: string;
    creditLimit?: number;
    prescriptionNotes?: string;
};

const initialCustomerState: Omit<Customer, 'id'> = {
  name: '',
  mobile: '',
  email: '',
  address: '',
  creditLimit: 0,
  prescriptionNotes: ''
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const fetchCustomers = useMemo(() => async () => {
    try {
      const response = await fetch('/api/customers');
      if(!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const formattedData = data.map((customer: any) => ({...customer, id: customer._id.toString()}));
      setCustomers(formattedData);
    } catch (error) {
      console.error('Failed to fetch customers', error);
      toast({
          title: 'Error',
          description: 'Failed to load customers.',
          variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsSheetOpen(true);
  };

  const handleAddClick = () => {
    setEditingCustomer(null);
    setIsSheetOpen(true);
  };

  const handleDelete = async (customerId: string) => {
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            toast({ title: 'Success', description: 'Customer deleted successfully.' });
            fetchCustomers(); // Refresh list
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete customer');
        }
    } catch (error: any) {
        console.error(error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
        <div className="ml-auto flex items-center gap-2">
           <Button size="sm" className="h-8 gap-1" onClick={handleAddClick}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Customer
              </span>
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your customers and view their purchase history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <Link href={`/customers/${customer.id}`} className="hover:underline text-primary">
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>{customer.mobile}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell className='max-w-xs truncate'>{customer.address}</TableCell>
                   <TableCell>₹{customer.creditLimit?.toFixed(2) ?? '0.00'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(customer)}>
                          <FilePenLine className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the customer account
                                and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(customer.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
            Showing <strong>1-{customers.length}</strong> of <strong>{customers.length}</strong> customers
          </div>
        </CardFooter>
      </Card>

      <CustomerFormSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        customer={editingCustomer}
        onFormSubmit={() => {
          setIsSheetOpen(false);
          setEditingCustomer(null);
          fetchCustomers();
        }}
      />
    </>
  );
}


type CustomerFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onFormSubmit: () => void;
};

function CustomerFormSheet({ open, onOpenChange, customer, onFormSubmit }: CustomerFormSheetProps) {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>(initialCustomerState);
    const { toast } = useToast();

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        } else {
            setFormData(initialCustomerState);
        }
    }, [customer, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: Number(value) }));
    }

    const handleSubmit = async () => {
        const url = customer ? `/api/customers/${customer.id}` : '/api/customers';
        const method = customer ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: `Customer ${customer ? 'updated' : 'created'} successfully.`,
                });
                onFormSubmit();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred.');
            }
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{customer ? 'Edit Customer' : 'Add Customer'}</SheetTitle>
                    <SheetDescription>
                        {customer ? 'Update the details for this customer.' : 'Enter the details for the new customer.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name *</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mobile" className="text-right">Mobile *</Label>
                        <Input id="mobile" value={formData.mobile} onChange={handleChange} className="col-span-3" required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">Address</Label>
                        <Textarea id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="creditLimit" className="text-right">Credit Limit (₹)</Label>
                        <Input id="creditLimit" type="number" value={formData.creditLimit} onChange={handleNumberChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prescriptionNotes" className="text-right">Prescription Notes</Label>
                        <Textarea id="prescriptionNotes" value={formData.prescriptionNotes} onChange={handleChange} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="prescription-upload" className="text-right">Upload</Label>
                         <Input id="prescription-upload" type="file" className="col-span-3" />
                     </div>
                </div>
                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{customer ? 'Save Changes' : 'Create Customer'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
