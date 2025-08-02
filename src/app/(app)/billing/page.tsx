
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
import { PlusCircle, Printer, Trash2, UserPlus, ChevronsUpDown, Check, Plus } from 'lucide-react';
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
  pillsPerStrip?: number;
  stripPrice?: number;
  isPillBased?: boolean;
};

type BillItem = {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
  isPillBased?: boolean;
  pillsPerStrip?: number;
  stripPrice?: number;
  pillQuantity?: number; // For pill-based medicines
};

export default function BillingPage() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  const { toast } = useToast();

  // New customer form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerMobile, setNewCustomerMobile] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Medicine selection state
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMedicineList, setShowMedicineList] = useState(false);
  const [showPillBasedOnly, setShowPillBasedOnly] = useState(false);

  // Filter medicines based on search term and pill-based filter
  const filteredMedicines = useMemo(() => {
    let filtered = medicines;
    
    // Filter by pill-based if enabled
    if (showPillBasedOnly) {
      filtered = filtered.filter(med => med.isPillBased);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [medicines, searchTerm, showPillBasedOnly]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.medicine-dropdown-container')) {
        setShowMedicineList(false);
      }
    };

    if (showMedicineList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMedicineList]);


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
    if (!selectedMedicine) {
      toast({
        title: 'No Medicine Selected',
        description: 'Please select a medicine from the dropdown.',
        variant: 'destructive'
      });
      return;
    }
    
    const medicine = medicines.find(m => m.id === selectedMedicine);
    if (!medicine) {
      toast({
        title: 'Medicine Not Found',
        description: 'Selected medicine could not be found.',
        variant: 'destructive'
      });
      return;
    }

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
        toast({
          title: 'Item Updated',
          description: `Increased quantity of ${medicine.name}`,
        });
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
      toast({
        title: 'Item Added',
        description: `Added ${medicine.name} to the bill`,
      });
    }
    setSelectedMedicine('');
    setOpenCombobox(false);
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

  const handlePillQuantityChange = (medicineId: string, pillQuantity: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if(!medicine) return;

    if (pillQuantity < 1) {
        handleRemoveItem(medicineId);
        return;
    };
    
    const maxPills = medicine.stock * (medicine.pillsPerStrip || 1);
    if (pillQuantity > maxPills) {
        toast({
            title: 'Stock Limit Exceeded',
            description: `Only ${maxPills} pills of ${medicine.name} available.`,
            variant: 'destructive'
        });
        setBillItems(billItems.map(item => item.medicineId === medicineId ? {...item, pillQuantity: maxPills} : item));
        return;
    }
    setBillItems(billItems.map(item => item.medicineId === medicineId ? {...item, pillQuantity} : item));
  };

  const subtotal = useMemo(() => {
    return billItems.reduce((acc, item) => {
      const medicine = medicines.find(m => m.id === item.medicineId);
      const isPillBased = item.isPillBased || medicine?.isPillBased;
      
      if (isPillBased) {
        const pillsPerStrip = item.pillsPerStrip || medicine?.pillsPerStrip || 1;
        const stripPrice = item.stripPrice || medicine?.stripPrice || 0;
        const pillQuantity = item.pillQuantity || 0;
        const unitPrice = stripPrice / pillsPerStrip;
        return acc + (unitPrice * pillQuantity);
      } else {
        return acc + (item.price * item.quantity);
      }
    }, 0);
  }, [billItems, medicines]);

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
      paymentMethod,
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
          description: `Bill ${result.billNumber} saved successfully!`,
        });
        
                 // Store the selected customer ID before resetting
         const currentCustomerId = selectedCustomer;
         
         // Reset state
         setBillItems([]);
         setDiscount(0);
         setSelectedCustomer('');
         setPaymentMethod('cash');
         setSelectedMedicine('');

         // Show success message with bill details
         setTimeout(() => {
           if (confirm(`Bill ${result.billNumber} saved successfully! Would you like to print the bill?`)) {
             // Create a simple bill print
             const printWindow = window.open('', '_blank');
             if (printWindow) {
               const customer = customers.find(c => c.id === currentCustomerId);
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Bill ${result.billNumber}</title>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                    .bill-info { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .items-table th { background-color: #f2f2f2; }
                    .totals { margin-top: 20px; }
                    .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                    .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
                    @media print { body { margin: 0; } }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>MinMedIQ Pharmacy</h1>
                    <p>Medical Store & Pharmacy</p>
                    <p>Bill ${result.billNumber}</p>
                  </div>
                  
                  <div class="bill-info">
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> ${customer?.name || 'Unknown'}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                  </div>
                  
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${billItems.map(item => {
                        const medicine = medicines.find(m => m.id === item.medicineId);
                        const isPillBased = item.isPillBased || medicine?.isPillBased;
                        const pillQuantity = item.pillQuantity || 0;
                        const pillsPerStrip = item.pillsPerStrip || medicine?.pillsPerStrip || 1;
                        const stripPrice = item.stripPrice || medicine?.stripPrice || 0;
                        
                        if (isPillBased) {
                          const unitPrice = stripPrice / pillsPerStrip;
                          const totalPrice = unitPrice * pillQuantity;
                          return `
                            <tr>
                              <td>${item.name} (Pill-based)</td>
                              <td>${pillQuantity} pills</td>
                              <td>₨${unitPrice.toFixed(2)}/pill</td>
                              <td>₨${totalPrice.toFixed(2)}</td>
                            </tr>
                          `;
                        } else {
                          return `
                            <tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>₨${item.price.toFixed(2)}</td>
                              <td>₨${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          `;
                        }
                      }).join('')}
                    </tbody>
                  </table>
                  
                  <div class="totals">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>₨${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                      <span>Tax (${tax}%):</span>
                      <span>₨${taxAmount.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                      <span>Discount:</span>
                      <span>-₨${discount.toFixed(2)}</span>
                    </div>
                    <div class="total-row grand-total">
                      <span>Grand Total:</span>
                      <span>₨${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div style="margin-top: 40px; text-align: center;">
                    <p>Thank you for your purchase!</p>
                    <p>Please visit again</p>
                  </div>
                </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.print();
            }
          }
        }, 1000);

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
             <div className="flex items-center justify-between">
               <Label htmlFor="medicine">Add Medicine</Label>
               <div className="flex items-center gap-2">
                 <Button
                   variant={showPillBasedOnly ? "default" : "outline"}
                   size="sm"
                   onClick={() => setShowPillBasedOnly(!showPillBasedOnly)}
                   className="text-xs"
                 >
                   {showPillBasedOnly ? "Show All" : "Pill-based Only"}
                 </Button>
               </div>
             </div>
             <div className="flex gap-2">
               <div className="relative flex-1 medicine-dropdown-container">
                 <Input
                   placeholder="Search medicines..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onFocus={() => setShowMedicineList(true)}
                   className="w-full"
                 />
                 
                 {/* Medicine List Dropdown */}
                 {showMedicineList && (
                   <div className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                     {showPillBasedOnly && (
                       <div className="p-2 bg-blue-50 border-b text-xs text-blue-700">
                         Showing pill-based medicines only
                       </div>
                     )}
                     {filteredMedicines.map((med) => (
                       <div
                         key={med.id}
                         className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                       >
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <span className="font-medium">{med.name}</span>
                             {med.isPillBased && (
                               <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                 Pill-based
                               </span>
                             )}
                           </div>
                           <div className="text-sm text-gray-500">
                             {med.isPillBased ? (
                               <>
                                 ₨{med.stripPrice?.toFixed(2)}/strip ({med.pillsPerStrip} pills) - Stock: {med.stock} strips
                               </>
                             ) : (
                               <>
                                 ₨{med.price.toFixed(2)} - Stock: {med.stock}
                               </>
                             )}
                           </div>
                         </div>
                         <div className="flex gap-2 ml-4">
                           <Button
                             size="sm"
                             variant="outline"
                             className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                             onClick={() => {
                               console.log('Add clicked for:', med.name);
                               const existingItem = billItems.find(item => item.medicineId === med.id);
                               
                               if (med.isPillBased) {
                                 // For pill-based medicines, add 1 pill by default
                                 if (existingItem) {
                                   if (existingItem.pillQuantity && existingItem.pillQuantity < (med.stock * (med.pillsPerStrip || 1))) {
                                     setBillItems(
                                       billItems.map(item =>
                                         item.medicineId === med.id
                                           ? { ...item, pillQuantity: (item.pillQuantity || 0) + 1 }
                                           : item
                                       )
                                     );
                                     toast({
                                       title: 'Item Updated',
                                       description: `Increased pill quantity of ${med.name}`,
                                     });
                                   } else {
                                     toast({
                                       title: 'Stock Limit Reached',
                                       description: `You cannot add more pills than available in stock.`,
                                       variant: 'destructive'
                                     });
                                   }
                                 } else {
                                   setBillItems([
                                     ...billItems,
                                     { 
                                       medicineId: med.id, 
                                       name: med.name, 
                                       quantity: 1, 
                                       price: med.price,
                                       isPillBased: true,
                                       pillsPerStrip: med.pillsPerStrip,
                                       stripPrice: med.stripPrice,
                                       pillQuantity: 1
                                     },
                                   ]);
                                   toast({
                                     title: 'Item Added',
                                     description: `Added 1 pill of ${med.name} to the bill`,
                                   });
                                 }
                               } else {
                                 // For regular medicines
                                 if (existingItem) {
                                   if (existingItem.quantity < med.stock) {
                                     setBillItems(
                                       billItems.map(item =>
                                         item.medicineId === med.id
                                           ? { ...item, quantity: item.quantity + 1 }
                                           : item
                                       )
                                     );
                                     toast({
                                       title: 'Item Updated',
                                       description: `Increased quantity of ${med.name}`,
                                     });
                                   } else {
                                     toast({
                                       title: 'Stock Limit Reached',
                                       description: `You cannot add more ${med.name} than is available in stock.`,
                                       variant: 'destructive'
                                     });
                                   }
                                 } else {
                                   setBillItems([
                                     ...billItems,
                                     { medicineId: med.id, name: med.name, quantity: 1, price: med.price },
                                   ]);
                                   toast({
                                     title: 'Item Added',
                                     description: `Added ${med.name} to the bill`,
                                   });
                                 }
                               }
                               setShowMedicineList(false);
                               setSearchTerm('');
                             }}
                             disabled={med.stock <= 0}
                           >
                             Add
                           </Button>
                         </div>
                       </div>
                     ))}
                     {filteredMedicines.length === 0 && (
                       <div className="p-3 text-center text-gray-500">
                         {showPillBasedOnly ? "No pill-based medicines found" : "No medicines found"}
                       </div>
                     )}
                   </div>
                 )}
               </div>
               <Button 
                 onClick={handleAddItem} 
                 size="icon" 
                 variant="outline" 
                 aria-label="Add item"
               >
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
                {billItems.map(item => {
                  const medicine = medicines.find(m => m.id === item.medicineId);
                  const isPillBased = item.isPillBased || medicine?.isPillBased;
                  const pillQuantity = item.pillQuantity || 0;
                  const pillsPerStrip = item.pillsPerStrip || medicine?.pillsPerStrip || 1;
                  const stripPrice = item.stripPrice || medicine?.stripPrice || 0;
                  
                  // Calculate price for pill-based medicines
                  const unitPrice = isPillBased ? (stripPrice / pillsPerStrip) : item.price;
                  const totalQuantity = isPillBased ? pillQuantity : item.quantity;
                  const totalPrice = unitPrice * totalQuantity;
                  
                  return (
                    <TableRow key={item.medicineId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {isPillBased && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Pill-based
                            </span>
                          )}
                        </div>
                        {isPillBased && (
                          <div className="text-xs text-muted-foreground">
                            {pillsPerStrip} pills/₨{stripPrice}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {isPillBased ? (
                          <div className="flex flex-col gap-1">
                            <Input 
                              type="number" 
                              value={pillQuantity} 
                              onChange={(e) => handlePillQuantityChange(item.medicineId, parseInt(e.target.value) || 0)}
                              className="h-8 w-20"
                              min="1"
                              max={medicine ? (medicine.stock * (medicine.pillsPerStrip || 1)) : 1000}
                              placeholder="Pills"
                            />
                            <div className="text-xs text-muted-foreground">
                              {Math.ceil(pillQuantity / pillsPerStrip)} strips needed
                            </div>
                          </div>
                        ) : (
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => handleQuantityChange(item.medicineId, parseInt(e.target.value) || 0)}
                            className="h-8 w-16"
                            min="1"
                            max={medicine?.stock}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isPillBased ? (
                          <div className="text-xs">
                            <div>₨{unitPrice.toFixed(2)}/pill</div>
                            <div className="text-muted-foreground">₨{stripPrice}/strip</div>
                          </div>
                        ) : (
                          `₨${item.price.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell className="text-right">₨{totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.medicineId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            <span>₨{subtotal.toFixed(2)}</span>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="tax" className='flex-1'>Tax (%)</Label>
            <Input id="tax" type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="h-8 w-24" />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax Amount</span>
            <span>+ ₨{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="discount" className='flex-1'>Discount (₨)</Label>
            <Input id="discount" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="h-8 w-24" />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>₨{grandTotal.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 items-stretch">
          <div className="flex items-center justify-between pb-2">
            <Label htmlFor="payment-method" className='flex-1'>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method" className="h-9 w-32">
                    <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="credit">Credit Sale</SelectItem>
                </SelectContent>
            </Select>
          </div>
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
