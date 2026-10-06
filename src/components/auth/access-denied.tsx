"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-md">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-2">
            <ShieldAlert className="size-8" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Access Restricted</CardTitle>
          <CardDescription>
            You do not possess the required academic authorization or role permissions to view this portal area.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button variant="default" className="w-full" render={<Link href="/admin/dashboard" />}>
            <ArrowLeft className="size-4 mr-2" /> Return to Overview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
