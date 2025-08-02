'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilePenLine, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

type Customer = {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    address: string;
    creditLimit?: number;
    prescriptionNotes?: string;
    purchaseHistory?: Bill[];
};

type Bill = {
    billId: string;
    billDate: string;
    grandTotal: number;
    status: string;
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCustomer() {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers/${params.id}`);
        if (response.status === 404) {
          notFound();
        }
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not load customer details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [params.id, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return null; // or a not found component
  }

  return (
    <div className="grid gap-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{customer.name}</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline">
                    <FilePenLine className="mr-2 h-4 w-4" />
                    Edit Customer
                </Button>
            </div>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
                    <p>{customer.mobile}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p>{customer.email || 'N/A'}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p>{customer.address || 'N/A'}</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Credit Limit</p>
                    <p>₹{customer.creditLimit?.toFixed(2) ?? '0.00'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                    <p className="font-semibold text-destructive">₹{/* Calculate from bills */ '0.00'}</p>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>Notes and uploaded prescription files.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Notes</h4>
                            <p className="text-sm text-muted-foreground">{customer.prescriptionNotes || 'No prescription notes available.'}</p>
                        </div>
                        <Separator />
                        <div>
                             <h4 className="font-medium mb-2">Uploaded Files</h4>
                             <div className="p-4 border-2 border-dashed rounded-lg text-center">
                                <p className="text-sm text-muted-foreground mb-2">No prescriptions uploaded yet.</p>
                                <Button variant="outline" size="sm">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Prescription
                                </Button>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Reminders & Notifications</CardTitle>
                     <CardDescription>Manage alerts for this customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border-2 border-dashed rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">SMS/Email integrations not configured.</p>
                        <Button variant="secondary" size="sm" disabled>Send Reminder</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>A record of all bills for this customer.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bill ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
                            customer.purchaseHistory.map(bill => (
                                <TableRow key={bill.billId}>
                                    <TableCell className="font-medium">{bill.billId}</TableCell>
                                    <TableCell>{format(new Date(bill.billDate), 'PPP')}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.status === 'Credit' ? 'destructive' : 'secondary'}>{bill.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₹{bill.grandTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No purchase history found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    </div>
  );
}

    