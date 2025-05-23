"use client"

import Link from "next/link";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfilePage = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6 rounded-lg border p-6">
          <div className="space-y-2">
            <h3 className="font-medium">Username</h3>
            <Input defaultValue="shadcn" />
            <p className="text-sm text-muted-foreground">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Email</h3>
            <Select defaultValue="verified">
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Select a verified email to display</SelectItem>
                <SelectItem value="example@example.com">example@example.com</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">You can manage verified email addresses in your email settings.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Bio</h3>
            <Textarea defaultValue="I own a computer." />
            <p className="text-sm text-muted-foreground">You can @mention other users and organizations to link to them.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">URLs</h3>
            <p className="text-sm text-muted-foreground">Add links to your website, blog, or social media profiles.</p>
            <div className="space-y-2">
              <Input defaultValue="https://shadcn.com" />
              <Input defaultValue="http://twitter.com/shadcn" />
              <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add URL
              </Button>
            </div>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90">Update profile</Button>
        </div>
        <div className="rounded-lg border">
          <div className="p-6">
            <nav className="space-y-2">
              <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium bg-muted">
                Profile
              </Link>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Account
              </Link>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Appearance
              </Link>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Notifications
              </Link>
              <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Display
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
