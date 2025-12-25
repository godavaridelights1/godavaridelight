import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Settings, FileText, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Newsletter Management | Admin",
  description: "Manage newsletters, templates, subscribers, and SMTP configuration",
}

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="border-b">
        <div className="flex gap-2 -mb-px overflow-x-auto pb-2">
          <Link
            href="/admin/newsletter/campaigns"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-primary hover:text-primary whitespace-nowrap"
          >
            <Mail className="h-4 w-4" />
            Campaigns
          </Link>
          <Link
            href="/admin/newsletter/templates"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-primary whitespace-nowrap"
          >
            <FileText className="h-4 w-4" />
            Templates
          </Link>
          <Link
            href="/admin/newsletter/subscribers"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-primary whitespace-nowrap"
          >
            <Users className="h-4 w-4" />
            Subscribers
          </Link>
          <Link
            href="/admin/newsletter/analytics"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-primary whitespace-nowrap"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/admin/newsletter/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-primary whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
