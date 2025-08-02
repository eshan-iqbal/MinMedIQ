'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UserPlus, Users, Building2, CreditCard, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  maxUsers: number;
  maxInventory: number;
  maxCustomers: number;
}

interface UserSubscription {
  _id: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  plan?: SubscriptionPlan;
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'chemist' | 'drugist';
  shopName?: string;
  shopAddress?: string;
  phone?: string;
  createdAt: string;
  subscription?: UserSubscription;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'chemist' as 'admin' | 'chemist' | 'drugist',
    shopName: '',
    shopAddress: '',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchSubscriptionPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubscriptionPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      setIsCreateDialogOpen(false);
      setFormData({ 
        email: '', 
        name: '', 
        password: '', 
        role: 'chemist',
        shopName: '',
        shopAddress: '',
        phone: '',
      });
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          role: formData.role,
          shopName: formData.shopName,
          shopAddress: formData.shopAddress,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ 
        email: '', 
        name: '', 
        password: '', 
        role: 'chemist',
        shopName: '',
        shopAddress: '',
        phone: '',
      });
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedUser || !selectedPlanId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          planId: selectedPlanId,
          autoRenew: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign subscription');
      }

      setIsSubscriptionDialogOpen(false);
      setSelectedPlanId('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role,
      shopName: user.shopName || '',
      shopAddress: user.shopAddress || '',
      phone: user.phone || '',
    });
    setIsEditDialogOpen(true);
  };

  const openProfileDialog = (user: User) => {
    setSelectedUser(user);
    setIsProfileDialogOpen(true);
  };

  const openSubscriptionDialog = (user: User) => {
    setSelectedUser(user);
    setIsSubscriptionDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      chemist: 'default',
      drugist: 'secondary',
    } as const;

    return <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>;
  };

  const getSubscriptionStatusBadge = (subscription?: UserSubscription) => {
    if (!subscription) {
      return <Badge variant="outline">No Subscription</Badge>;
    }

    const variants = {
      active: 'default',
      inactive: 'secondary',
      expired: 'destructive',
      cancelled: 'outline',
    } as const;

    return <Badge variant={variants[subscription.status as keyof typeof variants]}>{subscription.status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, their roles, shop information, and subscriptions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with shop information. Only admins can create new users.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="chemist">Chemist</SelectItem>
                      <SelectItem value="drugist">Drugist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="Enter shop/pharmacy name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopAddress">Shop Address</Label>
                <Textarea
                  id="shopAddress"
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                  placeholder="Enter shop address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({users.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, shop information, and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.shopName || 'No Shop'}</div>
                      {user.phone && (
                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getSubscriptionStatusBadge(user.subscription)}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProfileDialog(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSubscriptionDialog(user)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and shop details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="chemist">Chemist</SelectItem>
                    <SelectItem value="drugist">Drugist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shopName">Shop Name</Label>
              <Input
                id="edit-shopName"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shopAddress">Shop Address</Label>
              <Textarea
                id="edit-shopAddress"
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View detailed user information and subscription details
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">{selectedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shop Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Shop Name:</span>
                        <p className="text-sm">{selectedUser.shopName || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Phone:</span>
                        <p className="text-sm">{selectedUser.phone || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Address:</span>
                        <p className="text-sm">{selectedUser.shopAddress || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Subscription</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <div className="mt-1">{getSubscriptionStatusBadge(selectedUser.subscription)}</div>
                      </div>
                      {selectedUser.subscription && (
                        <>
                          <div>
                            <span className="text-sm font-medium">Plan:</span>
                            <p className="text-sm">{selectedUser.subscription.plan?.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Price:</span>
                            <p className="text-sm">₨{selectedUser.subscription.plan?.price}/{selectedUser.subscription.plan?.billingCycle}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Start Date:</span>
                            <p className="text-sm">{new Date(selectedUser.subscription.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">End Date:</span>
                            <p className="text-sm">{new Date(selectedUser.subscription.endDate).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Created:</span>
                    <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">User ID:</span>
                    <p className="text-sm font-mono text-xs">{selectedUser._id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Subscription Dialog */}
      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Subscription</DialogTitle>
            <DialogDescription>
              Assign a subscription plan to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subscription plan" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.name} - ₨{plan.price}/{plan.billingCycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsSubscriptionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignSubscription} disabled={!selectedPlanId}>
                Assign Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 