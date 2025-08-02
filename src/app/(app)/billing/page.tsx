'use client';

import React, { useState, useMemo } from 'react';
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
  TableFooter
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
import { PlusCircle, Printer, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const customersData = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Peter Jones' },
];

const medicinesData = [
  { id: '1', name: 'Paracetamol 500mg', price: 5.99, stock: 150 },
  { id: '2', name: 'Amoxicillin 250mg', price: 12.5, stock: 80 },
  { id: '3', name: 'Ibuprofen 200mg', price: 8.75, stock: 20 },
  { id: '4', name: 'Cough Syrup', price: 15.00, stock: 5 },
];

type BillItem = {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
};

export default function BillingPage() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10); // Example: 10% tax

  const handleAddItem = () => {
    if (!selectedMedicine) return;
    const medicine = medicinesData.find(m => m.id === selectedMedicine);
    if (!medicine) return;

    const existingItem = billItems.find(item => item.medicineId === medicine.id);
    if (existingItem) {
      setBillItems(
        billItems.map(item =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
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
    if (quantity < 1) return;
    setBillItems(billItems.map(item => item.medicineId === medicineId ? {...item, quantity} : item));
  };

  const subtotal = useMemo(() => {
    return billItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [billItems]);

  const taxAmount = useMemo(() => (subtotal * tax) / 100, [subtotal, tax]);
  
  const grandTotal = useMemo(() => {
    return subtotal + taxAmount - discount;
  }, [subtotal, taxAmount, discount]);

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
            <Select>
              <SelectTrigger id="customer" aria-label="Select customer">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customersData.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="medicine">Add Medicine</Label>
            <div className="flex gap-2">
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger id="medicine" aria-label="Select medicine">
                  <SelectValue placeholder="Select a medicine to add" />
                </SelectTrigger>
                <SelectContent>
                  {medicinesData.map(med => (
                    <SelectItem key={med.id} value={med.id}>
                      {med.name} (${med.price.toFixed(2)}) - Stock: {med.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        onChange={(e) => handleQuantityChange(item.medicineId, parseInt(e.target.value))}
                        className="h-8 w-16"
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
          <Button className="w-full">Save Bill</Button>
          <Button className="w-full" variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
