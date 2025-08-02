'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

const staffData = [
  { id: '1', name: 'Admin User', role: 'Admin' },
  { id: '2', name: 'Pharma One', role: 'Pharmacist' },
  { id: '3', name: 'Cashier One', role: 'Cashier' },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      <Tabs defaultValue="pharmacy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pharmacy">Pharmacy Details</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="backup">Data & Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="pharmacy">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Details</CardTitle>
              <CardDescription>
                Update your pharmacy's information. This will appear on bills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                <Input
                  id="pharmacy-name"
                  defaultValue="MinMedIQ Pharmacy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input id="logo" type="file" />
                <p className="text-sm text-muted-foreground">Recommended size: 200x100 pixels.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" defaultValue="29ABCDE1234F1Z5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" defaultValue="+1 (555) 123-4567" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Staff Accounts</CardTitle>
                    <CardDescription>
                        Manage who can access your pharmacy system.
                    </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Staff
                        </span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData.map(staff => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>
                        <Badge variant={staff.role === 'Admin' ? 'destructive' : 'secondary'}>{staff.role}</Badge>
                      </TableCell>
                       <TableCell className='text-right'>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Data & Backup</CardTitle>
              <CardDescription>
                Protect your data by creating regular backups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Last backup taken: 2024-05-20 10:30 AM
              </p>
              <Button>Create Backup Now</Button>
            </CardContent>
             <CardFooter>
              <p className="text-xs text-muted-foreground">
                It's recommended to create a backup at the end of each business day.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
