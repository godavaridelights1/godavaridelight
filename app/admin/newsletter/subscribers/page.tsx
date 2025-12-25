"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Search, Plus, Trash2, Download, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Subscriber {
  id: string
  email: string
  name?: string
  isActive: boolean
  preferences: string[]
  createdAt: string
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [activeCount, setActiveCount] = useState(0)
  const [inactiveCount, setInactiveCount] = useState(0)

  const itemsPerPage = 20

  useEffect(() => {
    fetchSubscribers()
  }, [page, searchQuery])

  useEffect(() => {
    if (searchQuery) {
      const filtered = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredSubscribers(filtered)
    } else {
      setFilteredSubscribers(subscribers)
    }
  }, [searchQuery, subscribers])

  useEffect(() => {
    const active = subscribers.filter(s => s.isActive).length
    const inactive = subscribers.filter(s => !s.isActive).length
    setActiveCount(active)
    setInactiveCount(inactive)
  }, [subscribers])

  const fetchSubscribers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/admin/newsletter-subscribers?page=${page}&limit=${itemsPerPage}&search=${searchQuery}`
      )
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data.subscribers)
        setTotalPages(data.pages)
      }
    } catch (error) {
      toast.error('Failed to fetch subscribers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubscriber = async () => {
    if (!newEmail) {
      toast.error('Email is required')
      return
    }

    try {
      const response = await fetch('/api/admin/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          name: newName || undefined,
          preferences: ['offers']
        })
      })

      if (!response.ok) throw new Error('Failed to add subscriber')

      const subscriber = await response.json()
      setSubscribers([subscriber, ...subscribers])
      setNewEmail('')
      setNewName('')
      setShowAddDialog(false)
      toast.success('Subscriber added successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add subscriber')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/newsletter-subscribers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (!response.ok) throw new Error('Failed to update subscriber')

      const updated = await response.json()
      setSubscribers(subscribers.map(s => s.id === id ? updated : s))
      toast.success(updated.isActive ? 'Subscriber activated' : 'Subscriber deactivated')
    } catch (error) {
      toast.error('Failed to update subscriber status')
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter-subscribers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete subscriber')

      setSubscribers(subscribers.filter(s => s.id !== id))
      setDeleteId(null)
      toast.success('Subscriber removed successfully')
    } catch (error) {
      toast.error('Failed to remove subscriber')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select subscribers to delete')
      return
    }

    if (!confirm(`Delete ${selectedIds.length} subscriber(s)?`)) return

    try {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`/api/admin/newsletter-subscribers/${id}`, { method: 'DELETE' })
        )
      )
      setSubscribers(subscribers.filter(s => !selectedIds.includes(s.id)))
      setSelectedIds([])
      toast.success(`${selectedIds.length} subscriber(s) deleted`)
    } catch (error) {
      toast.error('Failed to delete subscribers')
    }
  }

  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select subscribers')
      return
    }

    try {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`/api/admin/newsletter-subscribers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: true })
          })
        )
      )
      setSubscribers(subscribers.map(s =>
        selectedIds.includes(s.id) ? { ...s, isActive: true } : s
      ))
      setSelectedIds([])
      toast.success(`${selectedIds.length} subscriber(s) activated`)
    } catch (error) {
      toast.error('Failed to activate subscribers')
    }
  }

  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select subscribers')
      return
    }

    try {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`/api/admin/newsletter-subscribers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: false })
          })
        )
      )
      setSubscribers(subscribers.map(s =>
        selectedIds.includes(s.id) ? { ...s, isActive: false } : s
      ))
      setSelectedIds([])
      toast.success(`${selectedIds.length} subscriber(s) deactivated`)
    } catch (error) {
      toast.error('Failed to deactivate subscribers')
    }
  }

  const handleExportCSV = () => {
    const csv = [
      ['Email', 'Name', 'Status', 'Subscribed Date'],
      ...subscribers.map(s => [
        s.email,
        s.name || '',
        s.isActive ? 'Active' : 'Inactive',
        new Date(s.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Subscribers exported as CSV')
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredSubscribers.map(s => s.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your newsletter subscriber list</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscriber</DialogTitle>
                <DialogDescription>Manually add a new email subscriber to your list</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="subscriber@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name (Optional)</label>
                  <Input
                    placeholder="John Doe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddSubscriber}
                  className="w-full"
                >
                  Add Subscriber
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
              <p className="text-3xl font-bold">{subscribers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold">{inactiveCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscribers List
          </CardTitle>
          <CardDescription>
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : `Showing ${filteredSubscribers.length} of ${subscribers.length} subscribers`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Bulk Action Buttons */}
            {selectedIds.length > 0 && (
              <div className="flex gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium flex items-center">{selectedIds.length} selected</span>
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkActivate}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDeactivate}
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds([])}
                >
                  Clear
                </Button>
              </div>
            )}

            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No subscribers found</p>
              </div>
            ) : (
              <div className="space-y-2 border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_100px] gap-4 text-sm font-medium text-muted-foreground p-4 bg-muted/50 border-b">
                  <div>
                    <Checkbox
                      checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                  <div>Email</div>
                  <div>Name</div>
                  <div>Status</div>
                  <div>Subscribed</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredSubscribers.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(subscriber => (
                  <div key={subscriber.id} className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_100px] gap-4 items-center p-4 border-b hover:bg-muted/30 transition-colors last:border-b-0">
                    <div>
                      <Checkbox
                        checked={selectedIds.includes(subscriber.id)}
                        onChange={(checked) => {
                          if (checked.valueOf()) {
                            setSelectedIds([...selectedIds, subscriber.id])
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== subscriber.id))
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm font-mono break-all">{subscriber.email}</div>
                    <div className="text-sm">{subscriber.name || '-'}</div>
                    <div>
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(subscriber.id, subscriber.isActive)}
                        title={subscriber.isActive ? "Deactivate" : "Activate"}
                      >
                        {subscriber.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(subscriber.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove this subscriber? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm">
              <strong>Email:</strong> {subscribers.find(s => s.id === deleteId)?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteSubscriber(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
