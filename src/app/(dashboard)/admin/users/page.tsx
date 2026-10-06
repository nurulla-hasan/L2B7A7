"use client";

import * as React from "react";
import { Plus, Search, Filter, MoreHorizontal, ShieldCheck, UserCheck, GraduationCap, Ban } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  status: "ACTIVE" | "BLOCKED";
  authProvider: "CREDENTIAL" | "GOOGLE";
  department: string;
  createdAt: string;
}

const mockUsers: UserItem[] = [
  {
    id: "usr-1",
    name: "Dr. Golap Hasan",
    email: "admin@university.edu",
    role: "ADMIN",
    status: "ACTIVE",
    authProvider: "CREDENTIAL",
    department: "Administration",
    createdAt: "Jan 10, 2025",
  },
  {
    id: "usr-2",
    name: "Prof. Sarah Ahmed",
    email: "sarah.ahmed@university.edu",
    role: "TEACHER",
    status: "ACTIVE",
    authProvider: "GOOGLE",
    department: "Computer Science",
    createdAt: "Feb 14, 2025",
  },
  {
    id: "usr-3",
    name: "Tanvir Rahman",
    email: "tanvir.2026@student.edu",
    role: "STUDENT",
    status: "ACTIVE",
    authProvider: "CREDENTIAL",
    department: "Computer Science",
    createdAt: "Sep 01, 2025",
  },
  {
    id: "usr-4",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@student.edu",
    role: "STUDENT",
    status: "ACTIVE",
    authProvider: "GOOGLE",
    department: "Electrical Engineering",
    createdAt: "Sep 05, 2025",
  },
  {
    id: "usr-5",
    name: "Dr. K. M. Rahman",
    email: "km.rahman@university.edu",
    role: "TEACHER",
    status: "ACTIVE",
    authProvider: "CREDENTIAL",
    department: "Mathematics",
    createdAt: "Mar 01, 2025",
  },
  {
    id: "usr-6",
    name: "Sabbir Hossain",
    email: "sabbir.hossain@student.edu",
    role: "STUDENT",
    status: "BLOCKED",
    authProvider: "CREDENTIAL",
    department: "Computer Science",
    createdAt: "Oct 12, 2025",
  },
];

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [users, setUsers] = React.useState<UserItem[]>(mockUsers);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
          toast.success(`${u.name} is now ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student registrations, faculty access, and administrator credentials.
          </p>
        </div>

        <Button size="sm" onClick={() => toast.info("Add User modal ready to connect with API.")}>
          <Plus className="size-4 mr-1.5" />
          Add User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground hidden sm:inline items-center gap-1">
              <Filter className="size-3.5" /> Role:
            </span>
            <div className="flex gap-1">
              {(["ALL", "ADMIN", "TEACHER", "STUDENT"] as const).map((r) => (
                <Button
                  key={r}
                  variant={roleFilter === r ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2.5 h-8"
                  onClick={() => setRoleFilter(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">User Directory</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} registered accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Auth Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    {user.role === "ADMIN" && (
                      <Badge variant="admin" className="gap-1 text-[11px]">
                        <ShieldCheck className="size-3" /> Admin
                      </Badge>
                    )}
                    {user.role === "TEACHER" && (
                      <Badge variant="manager" className="gap-1 text-[11px]">
                        <GraduationCap className="size-3" /> Teacher
                      </Badge>
                    )}
                    {user.role === "STUDENT" && (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <UserCheck className="size-3" /> Student
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.department}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-muted">
                      {user.authProvider}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.status === "ACTIVE" ? (
                      <Badge variant="success" className="text-[11px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[11px]">
                        Blocked
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-muted rounded cursor-pointer">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                          {user.status === "ACTIVE" ? (
                            <span className="flex items-center text-destructive gap-2">
                              <Ban className="size-4" /> Block User
                            </span>
                          ) : (
                            <span className="flex items-center text-emerald-600 gap-2">
                              <UserCheck className="size-4" /> Activate User
                            </span>
                          )}
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
    </div>
  );
}
