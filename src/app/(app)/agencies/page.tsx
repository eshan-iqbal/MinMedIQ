'use client';

import { useEffect, useState } from 'react';
import {
  PlusCircle,
  FilePenLine,
  Trash2,
  Search,
  X,
  RefreshCw,
  Building2,
  User,
  Phone,
  MapPin,
  Package,
  Eye,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Agency = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  email?: string;
  gstNumber?: string;
  notes?: string;
}

type Medicine = {
  id: string;
  name: string;
  batch: string;
  expiry: string;
  price: number;
  stock: number;
  agency?: string;
  purchaseDate?: string;
  purchaseOrder?: string;
}

type FormData = {
  name: string;
  contact: string;
  phone: string;
  address: string;
  email: string;
  gstNumber: string;
  notes: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    phone: '',
    address: '',
    email: '',
    gstNumber: '',
    notes: ''
  });
  const { toast } = useToast();

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/agencies');
      const data = await response.json();
      setAgencies(data);
      setFilteredAgencies(data);
    } catch (error) {
      console.error("Failed to fetch agencies", error);
      toast({
        title: 'Error',
        description: 'Failed to load agencies.',
        variant: 'destructive'
      });
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines", error);
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchMedicines();
  }, [toast]);

  // Filter agencies based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAgencies(agencies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = agencies.filter(agency => 
      agency.name.toLowerCase().includes(query) ||
      agency.contact.toLowerCase().includes(query) ||
      agency.phone.includes(query) ||
      agency.address.toLowerCase().includes(query)
    );
    setFilteredAgencies(filtered);
  }, [searchQuery, agencies]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact || !formData.phone || !formData.address) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/agencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          phone: formData.phone,
          address: formData.address,
          email: formData.email || undefined,
          gstNumber: formData.gstNumber || undefined,
          notes: formData.notes || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add agency');
      }

      const newAgency = await response.json();
      setAgencies(prev => [...prev, newAgency]);
      setFilteredAgencies(prev => [...prev, newAgency]);
      
      // Reset form
      setFormData({
        name: '',
        contact: '',
        phone: '',
        address: '',
        email: '',
        gstNumber: '',
        notes: ''
      });
      
      setIsDialogOpen(false);
             toast({
         title: 'Success',
         description: 'Supplier added successfully.',
       });
    } catch (error) {
      console.error('Failed to add agency:', error);
             toast({
         title: 'Error',
         description: 'Failed to add supplier.',
         variant: 'destructive'
       });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setFormData({
      name: agency.name,
      contact: agency.contact,
      phone: agency.phone,
      address: agency.address,
      email: agency.email || '',
      gstNumber: agency.gstNumber || '',
      notes: agency.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAgency || !formData.name || !formData.contact || !formData.phone || !formData.address) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/agencies/${editingAgency.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          phone: formData.phone,
          address: formData.address,
          email: formData.email || undefined,
          gstNumber: formData.gstNumber || undefined,
          notes: formData.notes || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agency');
      }

      // Update the agency in the local state
      setAgencies(prev => prev.map(agency => 
        agency.id === editingAgency.id 
          ? { 
              ...agency, 
              name: formData.name, 
              contact: formData.contact, 
              phone: formData.phone, 
              address: formData.address,
              email: formData.email || undefined,
              gstNumber: formData.gstNumber || undefined,
              notes: formData.notes || undefined
            }
          : agency
      ));
      setFilteredAgencies(prev => prev.map(agency => 
        agency.id === editingAgency.id 
          ? { 
              ...agency, 
              name: formData.name, 
              contact: formData.contact, 
              phone: formData.phone, 
              address: formData.address,
              email: formData.email || undefined,
              gstNumber: formData.gstNumber || undefined,
              notes: formData.notes || undefined
            }
          : agency
      ));
      
      setIsEditDialogOpen(false);
      setEditingAgency(null);
             toast({
         title: 'Success',
         description: 'Supplier updated successfully.',
       });
    } catch (error) {
      console.error('Failed to update agency:', error);
             toast({
         title: 'Error',
         description: 'Failed to update supplier.',
         variant: 'destructive'
       });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
         if (!confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    try {
      const response = await fetch(`/api/agencies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agency');
      }

      setAgencies(prev => prev.filter(agency => agency.id !== id));
      setFilteredAgencies(prev => prev.filter(agency => agency.id !== id));
             toast({
         title: 'Success',
         description: 'Supplier deleted successfully.',
       });
    } catch (error) {
      console.error('Failed to delete agency:', error);
             toast({
         title: 'Error',
         description: 'Failed to delete supplier.',
         variant: 'destructive'
       });
    }
  };

  const handleViewMedicines = (agency: Agency) => {
    setSelectedAgency(agency);
    setIsMedicineDialogOpen(true);
  };

  const getAgencyMedicines = (agencyName: string) => {
    return medicines.filter(medicine => medicine.agency === agencyName);
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Suppliers</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                         <Input
               placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 w-64"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 gap-1"
            onClick={fetchAgencies}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Refresh
            </span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                             <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
               Add Supplier
             </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
                             <DialogHeader>
                 <DialogTitle>Add New Supplier</DialogTitle>
                 <DialogDescription>
                   Add a new medicine supplier or agency to your system.
                 </DialogDescription>
               </DialogHeader>
              <div className="grid gap-4 py-4">
                                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="name" className="text-right">
                     Supplier Name *
                   </Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. ABC Pharma Agency" 
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact Person *
                  </Label>
                  <Input 
                    id="contact" 
                    placeholder="e.g. John Doe" 
                    className="col-span-3"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone Number *
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="e.g. +91 98765 43210" 
                    className="col-span-3"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="e.g. contact@abcpharma.com" 
                    className="col-span-3"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gstNumber" className="text-right">
                    GST Number
                  </Label>
                  <Input 
                    id="gstNumber" 
                    placeholder="e.g. 27ABCDE1234F1Z5" 
                    className="col-span-3"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address *
                  </Label>
                  <Textarea 
                    id="address" 
                    placeholder="Enter complete address" 
                    className="col-span-3"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional notes about this agency" 
                    className="col-span-3"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                                   <Button 
                     onClick={handleSubmit}
                     disabled={isLoading}
                   >
                     {isLoading ? 'Saving...' : 'Save Supplier'}
                   </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Suppliers</CardTitle>
          <CardDescription>
            Manage your medicine suppliers and agencies. Track all your medicine sources.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                                             <p className="text-sm text-muted-foreground">
                         {searchQuery ? `No suppliers found matching "${searchQuery}"` : 'No suppliers found'}
                       </p>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => {
                  const agencyMedicines = getAgencyMedicines(agency.name);
                  return (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">{agency.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {agency.contact}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {agency.phone}
                        </div>
                      </TableCell>
                      <TableCell>{agency.email || '-'}</TableCell>
                      <TableCell>{agency.gstNumber || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-xs">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{agency.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{agencyMedicines.length} medicines</span>
                          {agencyMedicines.length > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewMedicines(agency)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <FilePenLine className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewMedicines(agency)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Medicines
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(agency)}>
                              <FilePenLine className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(agency.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

             {/* Edit Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Edit Supplier</DialogTitle>
             <DialogDescription>
               Update the supplier details.
             </DialogDescription>
           </DialogHeader>
          <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="edit-name" className="text-right">
                 Supplier Name
               </Label>
              <Input 
                id="edit-name" 
                placeholder="e.g. ABC Pharma Agency" 
                className="col-span-3"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contact" className="text-right">
                Contact Person
              </Label>
              <Input 
                id="edit-contact" 
                placeholder="e.g. John Doe" 
                className="col-span-3"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone Number
              </Label>
              <Input 
                id="edit-phone" 
                placeholder="e.g. +91 98765 43210" 
                className="col-span-3"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input 
                id="edit-email" 
                type="email" 
                placeholder="e.g. contact@abcpharma.com" 
                className="col-span-3"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-gstNumber" className="text-right">
                GST Number
              </Label>
              <Input 
                id="edit-gstNumber" 
                placeholder="e.g. 27ABCDE1234F1Z5" 
                className="col-span-3"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Textarea 
                id="edit-address" 
                placeholder="Enter complete address" 
                className="col-span-3"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Textarea 
                id="edit-notes" 
                placeholder="Any additional notes about this agency" 
                className="col-span-3"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
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
               {isLoading ? 'Updating...' : 'Update Supplier'}
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Medicines Dialog */}
      <Dialog open={isMedicineDialogOpen} onOpenChange={setIsMedicineDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Medicines from {selectedAgency?.name}
            </DialogTitle>
            <DialogDescription>
              View all medicines supplied by this agency.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAgency && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAgencyMedicines(selectedAgency.name).map((medicine) => (
                    <Card key={medicine.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        <CardDescription>
                          Batch: {medicine.batch} | Expiry: {medicine.expiry}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">₹{medicine.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stock:</span>
                            <span className={`font-medium ${medicine.stock < 25 ? 'text-red-600' : 'text-green-600'}`}>
                              {medicine.stock} units
                            </span>
                          </div>
                          {medicine.purchaseDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Purchase Date:</span>
                              <span className="font-medium">{medicine.purchaseDate}</span>
                            </div>
                          )}
                          {medicine.purchaseOrder && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Order No:</span>
                              <span className="font-medium">{medicine.purchaseOrder}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {getAgencyMedicines(selectedAgency.name).length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No medicines found from this agency.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 