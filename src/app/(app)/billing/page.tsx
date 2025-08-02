'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet';
import { PlusCircle, Printer, Trash2, UserPlus, ChevronsUpDown, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';


type Customer = {
  id: string;
  name: string;
};

type Medicine = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type BillItem = {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
};

export default function BillingPage() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  const { toast } = useToast();

  // New customer form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerMobile, setNewCustomerMobile] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Combobox state
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');


  useEffect(() => {
    async function fetchData() {
      try {
        const customersRes = await fetch('/api/customers');
        const customersData = await customersRes.json();
        setCustomers(customersData);

        const medicinesRes = await fetch('/api/medicines');
        const medicinesData = await medicinesRes.json();
        setMedicines(medicinesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
            title: 'Error',
            description: 'Failed to load initial data.',
            variant: 'destructive'
        });
      }
    }
    fetchData();
  }, [toast]);

  const handleAddCustomer = async () => {
    if(!newCustomerName || !newCustomerMobile) {
        toast({ title: 'Error', description: 'Customer name and mobile are required.', variant: 'destructive' });
        return;
    }

    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCustomerName, mobile: newCustomerMobile, address: newCustomerAddress }),
        });

        if (response.ok) {
            const newCustomer = await response.json();
            setCustomers(prev => [...prev, newCustomer]);
            setSelectedCustomer(newCustomer.id);
            toast({
                title: 'Success',
                description: `Customer ${newCustomer.name} added successfully.`,
            });
            // Reset form and close sheet
            setNewCustomerName('');
            setNewCustomerMobile('');
            setNewCustomerAddress('');
            setIsCustomerSheetOpen(false);
        } else {
            throw new Error('Failed to add customer');
        }
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error',
            description: 'Something went wrong while adding the customer.',
            variant: 'destructive'
        });
    }
  };


  const handleAddItem = () => {
    if (!selectedMedicine) return;
    const medicine = medicines.find(m => m.id === selectedMedicine);
    if (!medicine) return;

    if(medicine.stock <= 0) {
        toast({
            title: 'Out of Stock',
            description: `${medicine.name} is out of stock.`,
            variant: 'destructive'
        });
        return;
    }

    const existingItem = billItems.find(item => item.medicineId === medicine.id);
    if (existingItem) {
      if (existingItem.quantity < medicine.stock) {
        setBillItems(
          billItems.map(item =>
            item.medicineId === medicine.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast({
            title: 'Stock Limit Reached',
            description: `You cannot add more ${medicine.name} than is available in stock.`,
            variant: 'destructive'
        });
      }
    } else {
      setBillItems([
        ...billItems,
        { medicineId: medicine.id, name: medicine.name, quantity: 1, price: medicine.price },
      ]);
    }
    setSelectedMedicine('');
  };

  const handleRemoveItem = (medicineId: string) => {
    setBillItems(billItems.filter(item => item.medicineId !== medicineId));
  };
  
  const handleQuantityChange = (medicineId: string, quantity: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if(!medicine) return;

    if (quantity < 1) {
        handleRemoveItem(medicineId);
        return;
    };
    if (quantity > medicine.stock) {
        toast({
            title: 'Stock Limit Exceeded',
            description: `Only ${medicine.stock} units of ${medicine.name} available.`,
            variant: 'destructive'
        });
        setBillItems(billItems.map(item => item.medicineId === medicineId ? {...item, quantity: medicine.stock} : item));
        return;
    }
    setBillItems(billItems.map(item => item.medicineId === medicineId ? {...item, quantity} : item));
  };

  const subtotal = useMemo(() => {
    return billItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [billItems]);

  const taxAmount = useMemo(() => (subtotal * tax) / 100, [subtotal, tax]);
  
  const grandTotal = useMemo(() => {
    return subtotal + taxAmount - discount;
  }, [subtotal, taxAmount, discount]);

  const handleSaveBill = async () => {
    if (!selectedCustomer) {
      toast({ title: 'Error', description: 'Please select a customer.', variant: 'destructive' });
      return;
    }
    if (billItems.length === 0) {
      toast({ title: 'Error', description: 'Please add items to the bill.', variant: 'destructive' });
      return;
    }

    const billData = {
      customerId: selectedCustomer,
      items: billItems,
      subtotal,
      tax,
      taxAmount,
      discount,
      grandTotal,
      billDate: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: `Bill ${result.billId} saved successfully.`,
        });
        // Reset state
        setBillItems([]);
        setDiscount(0);
        setSelectedCustomer('');

      } else {
        throw new Error('Failed to save the bill');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong while saving the bill.',
        variant: 'destructive'
      });
    }
  };


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Create Bill</CardTitle>
          <CardDescription>
            Select a customer and add medicines to generate a new bill.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="customer">Customer</Label>
             <div className="flex gap-2">
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer" aria-label="Select customer">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Sheet open={isCustomerSheetOpen} onOpenChange={setIsCustomerSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" aria-label="Add customer">
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Customer</SheetTitle>
                            <SheetDescription>
                                Enter the details for the new customer.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-customer-name" className="text-right">Name</Label>
                                <Input id="new-customer-name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-customer-mobile" className="text-right">Mobile</Label>
                                <Input id="new-customer-mobile" value={newCustomerMobile} onChange={(e) => setNewCustomerMobile(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-customer-address" className="text-right">Address</Label>
                                <Textarea id="new-customer-address" value={newCustomerAddress} onChange={(e) => setNewCustomerAddress(e.target.value)} className="col-span-3" />
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button onClick={handleAddCustomer}>Add Customer</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="medicine">Add Medicine</Label>
            <div className="flex gap-2">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="w-full justify-between"
                        >
                            {selectedMedicine
                                ? medicines.find((med) => med.id === selectedMedicine)?.name
                                : "Select a medicine to add"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search medicine..." />
                            <CommandList>
                                <CommandEmpty>No medicine found.</CommandEmpty>
                                <CommandGroup>
                                    {medicines.map((med) => (
                                        <CommandItem
                                            key={med.id}
                                            value={med.id}
                                            disabled={med.stock <= 0}
                                            onSelect={(currentValue) => {
                                                setSelectedMedicine(currentValue === selectedMedicine ? "" : currentValue)
                                                setOpenCombobox(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedMedicine === med.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {med.name} (${med.price.toFixed(2)}) - Stock: {med.stock}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
              <Button onClick={handleAddItem} size="icon" variant="outline" aria-label="Add item">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No items added yet.
                    </TableCell>
                  </TableRow>
                )}
                {billItems.map(item => (
                  <TableRow key={item.medicineId}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item.medicineId, parseInt(e.target.value) || 0)}
                        className="h-8 w-16"
                        min="1"
                        max={medicines.find(m => m.id === item.medicineId)?.stock}
                      />
                    </TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.medicineId)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 h-fit">
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="tax" className='flex-1'>Tax (%)</Label>
            <Input id="tax" type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="h-8 w-24" />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax Amount</span>
            <span>+ ${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="discount" className='flex-1'>Discount ($)</Label>
            <Input id="discount" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="h-8 w-24" />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 items-stretch">
          <Button className="w-full" onClick={handleSaveBill}>Save Bill</Button>
          <Button className="w-full" variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
