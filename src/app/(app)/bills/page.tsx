'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Printer, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type Bill = {
  _id: string;
  billId: string;
  customerId: string;
  customerName: string;
  items: Array<{
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  billDate: string;
  status: string;
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/bills');
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      } else {
        throw new Error('Failed to fetch bills');
      }
    } catch (error) {
      console.error('Failed to fetch bills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bills.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewDialogOpen(true);
  };

  const handlePrintBill = (bill: Bill) => {
    // Create a printable version of the bill
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tax Invoice - ${bill.billId}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
              line-height: 1.4;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              border-bottom: 2px solid #000; 
              padding-bottom: 15px; 
              margin-bottom: 20px; 
            }
            .store-info { 
              text-align: left; 
              flex: 1;
            }
            .invoice-info { 
              text-align: right; 
              flex: 1;
            }
            .store-name { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 5px;
              color: #1f2937;
            }
            .store-details { 
              font-size: 11px; 
              color: #6b7280;
              margin-bottom: 10px;
            }
            .invoice-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 10px;
              color: #1f2937;
            }
            .invoice-details { 
              font-size: 11px; 
              color: #6b7280;
            }
            .customer-info { 
              margin-bottom: 20px; 
              padding: 15px;
              background-color: #f9fafb;
              border-radius: 5px;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
              font-size: 11px;
            }
            .items-table th, .items-table td { 
              border: 1px solid #d1d5db; 
              padding: 8px; 
              text-align: left; 
            }
            .items-table th { 
              background-color: #f3f4f6; 
              font-weight: bold;
              color: #374151;
            }
            .totals { 
              margin-top: 20px; 
              border-top: 2px solid #d1d5db;
              padding-top: 15px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 5px 0; 
              font-size: 12px;
            }
            .grand-total { 
              font-weight: bold; 
              font-size: 16px; 
              border-top: 2px solid #000; 
              padding-top: 10px; 
              margin-top: 10px;
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 10px;
              color: #6b7280;
              border-top: 1px solid #d1d5db;
              padding-top: 15px;
            }
            .user-info {
              font-size: 10px;
              color: #6b7280;
              margin-top: 5px;
            }
            @media print { 
              body { margin: 0; } 
              .header { page-break-inside: avoid; }
              .items-table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-info">
              <div class="store-name">${currentUser?.shopName || 'MinMedIQ Pharmacy'}</div>
              <div class="store-details">
                ${currentUser?.shopAddress || 'Medical Store & Pharmacy'}<br>
                ${currentUser?.phone ? `Tel: ${currentUser.phone}` : 'Tel: (021) 508-9888'}<br>
                ${currentUser?.email || 'Email: info@minmediq.com'}<br>
                GST Number: 4212345678<br>
                (All amounts are GST inclusive)
              </div>
              <div class="user-info">
                Generated by: ${currentUser?.name || 'System User'}<br>
                Date: ${new Date().toLocaleDateString()}<br>
                Time: ${new Date().toLocaleTimeString()}
              </div>
            </div>
            <div class="invoice-info">
              <div class="invoice-title">TAX INVOICE</div>
              <div class="invoice-details">
                Invoice No: ${bill.billId}<br>
                Date: ${new Date(bill.billDate).toLocaleDateString()}<br>
                Payment Method: ${bill.paymentMethod.toUpperCase()}<br>
                Customer ID: ${bill.customerId}
              </div>
            </div>
          </div>
          
          <div class="customer-info">
            <strong>Bill To:</strong><br>
            <strong>${bill.customerName}</strong><br>
            Customer ID: ${bill.customerId}
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 40%;">Description</th>
                <th style="width: 15%; text-align: center;">Quantity</th>
                <th style="width: 20%; text-align: right;">Unit Price</th>
                <th style="width: 25%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${bill.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>GST (${bill.tax}%):</span>
              <span>₹${bill.taxAmount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${bill.discount.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>₹${bill.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for choosing ${currentUser?.shopName || 'MinMedIQ Pharmacy'}!</strong></p>
            <p>For any queries, please contact us at ${currentUser?.phone || '(021) 508-9888'}</p>
            <p>This is a computer generated invoice. No signature required.</p>
            <p style="margin-top: 10px; font-size: 9px; color: #9ca3af;">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
              Invoice processed by: ${currentUser?.name || 'System User'}
            </p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading bills...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Bills</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
          <CardDescription>
            View and manage all generated bills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No bills found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell className="font-medium">#{bill.billId}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{new Date(bill.billDate).toLocaleDateString()}</TableCell>
                    <TableCell>{bill.items.length} items</TableCell>
                    <TableCell><span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{bill.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{bill.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Completed</Badge>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewBill(bill)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintBill(bill)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Bill
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Bill Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              View complete bill information
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Bill ID</Label>
                  <p className="text-sm text-muted-foreground">#{selectedBill.billId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBill.billDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-muted-foreground">{selectedBill.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{selectedBill.paymentMethod}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                                              <span><span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                                      <span><span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{selectedBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({selectedBill.tax}%):</span>
                                      <span><span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{selectedBill.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                                      <span>-<span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{selectedBill.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Grand Total:</span>
                                      <span><span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{selectedBill.grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handlePrintBill(selectedBill)} className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Bill
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 