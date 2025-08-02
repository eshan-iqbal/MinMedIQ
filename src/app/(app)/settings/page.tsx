'use client';
import { useState, useEffect, useMemo } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, FilePenLine, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type Staff = {
    id: string;
    name: string;
    role: 'Admin' | 'Pharmacist' | 'Cashier' | 'Manager';
    email: string;
};

const initialStaffState: Omit<Staff, 'id'> = {
  name: '',
  role: 'Cashier',
  email: ''
};

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
          <StaffManagementTab />
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

function StaffManagementTab() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const { toast } = useToast();

  const fetchStaff = useMemo(() => async () => {
    try {
      const response = await fetch('/api/staff');
      if(!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff', error);
      toast({
          title: 'Error',
          description: 'Failed to load staff members.',
          variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleEditClick = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsSheetOpen(true);
  };

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsSheetOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    try {
        const response = await fetch(`/api/staff/${staffId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            toast({ title: 'Success', description: 'Staff member deleted successfully.' });
            fetchStaff(); // Refresh list
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete staff member');
        }
    } catch (error: any) {
        console.error(error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Staff Accounts</CardTitle>
                <CardDescription>
                    Manage who can access your pharmacy system.
                </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={handleAddClick}>
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'Admin' ? 'destructive' : 'secondary'}>{member.role}</Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(member)}>
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
                                        This action cannot be undone. This will permanently delete the staff account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(member.id)}>Continue</AlertDialogAction>
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
      </Card>
      <StaffFormSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        staffMember={editingStaff}
        onFormSubmit={() => {
          setIsSheetOpen(false);
          fetchStaff();
        }}
      />
    </>
  );
}


type StaffFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMember: Staff | null;
  onFormSubmit: () => void;
};

function StaffFormSheet({ open, onOpenChange, staffMember, onFormSubmit }: StaffFormSheetProps) {
    const [formData, setFormData] = useState<Omit<Staff, 'id'>>(initialStaffState);
    const { toast } = useToast();

    useEffect(() => {
        if (staffMember) {
            setFormData(staffMember);
        } else {
            setFormData(initialStaffState);
        }
    }, [staffMember]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleRoleChange = (value: Staff['role']) => {
        setFormData(prev => ({ ...prev, role: value }));
    }

    const handleSubmit = async () => {
        const url = staffMember ? `/api/staff/${staffMember.id}` : '/api/staff';
        const method = staffMember ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: `Staff member ${staffMember ? 'updated' : 'created'} successfully.`,
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
                    <SheetTitle>{staffMember ? 'Edit Staff' : 'Add Staff'}</SheetTitle>
                    <SheetDescription>
                        {staffMember ? 'Update the details for this staff member.' : 'Enter the details for the new staff member.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name *</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                         <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                                <SelectItem value="Cashier">Cashier</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input id="password" type="password" className="col-span-3" placeholder={staffMember ? 'Leave blank to keep unchanged' : ''}/>
                    </div>
                </div>
                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{staffMember ? 'Save Changes' : 'Create Staff'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
