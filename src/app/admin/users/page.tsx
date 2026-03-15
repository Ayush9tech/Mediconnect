"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserPlus, Shield, ShieldCheck, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const SYSTEM_USERS = [
  { id: 1, name: "Dr. Julian Vane", email: "julian.vane@mediconnect.com", role: "Admin", status: "Active" },
  { id: 2, name: "Dr. Sarah Smith", email: "s.smith@hospital.com", role: "Doctor", status: "Active" },
  { id: 3, name: "Dr. Michael Chen", email: "m.chen@clinic.com", role: "Doctor", status: "Active" },
  { id: 4, name: "Admin Support", email: "support@mediconnect.com", role: "Admin", status: "Active" },
  { id: 5, name: "Dr. Robert Miller", email: "r.miller@sports.com", role: "Doctor", status: "Inactive" },
];

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar userRole="admin" />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">User Management</h2>
            <p className="text-muted-foreground">Oversee clinical staff access, roles, and system permissions.</p>
          </div>
          <Button className="bg-primary">
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <Card className="border-none ring-1 ring-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-lg">System Users</CardTitle>
            <CardDescription>A list of all users currently registered in the hub.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SYSTEM_USERS.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit gap-1 items-center">
                        {user.role === 'Admin' ? <ShieldCheck className="h-3 w-3 text-primary" /> : <Shield className="h-3 w-3" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                          <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="mr-2 h-4 w-4" /> Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
