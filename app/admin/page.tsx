"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plus, Edit, Trash2, Mail, FolderOpen, Users, BarChart3, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient, type Project, type Contact } from "@/lib/api"

export default function AdminDashboard() {
  const { user, logout, token } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/login")
      return
    }

    if (token) {
      apiClient.setToken(token)
    }

    loadData()
  }, [user, token, router])

  const loadData = async () => {
    setLoading(true)

    // Load projects
    const projectsResponse = await apiClient.getProjects()
    if (projectsResponse.data) {
      setProjects(projectsResponse.data)
    }

    // Load contacts
    const contactsResponse = await apiClient.getContacts({ limit: 50 })
    if (contactsResponse.data?.contacts) {
      setContacts(contactsResponse.data.contacts)
    }

    // Load dashboard stats
    const statsResponse = await apiClient.getDashboardStats()
    if (statsResponse.data) {
      setStats(statsResponse.data)
    }

    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleMarkAsRead = async (contactId: string) => {
    const response = await apiClient.markContactAsRead(contactId)
    if (response.data) {
      setContacts((prev) => prev.map((contact) => (contact._id === contactId ? { ...contact, read: true } : contact)))
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const response = await apiClient.deleteContact(contactId)
      if (response.data) {
        setContacts((prev) => prev.filter((contact) => contact._id !== contactId))
      }
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const response = await apiClient.deleteProject(projectId)
      if (response.data) {
        setProjects((prev) => prev.filter((project) => project._id !== projectId))
      }
    }
  }

  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.username}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="contacts">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {projects.filter((p) => p.featured).length} featured
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contacts.length}</div>
                    <p className="text-xs text-muted-foreground">{contacts.filter((c) => !c.read).length} unread</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
                    <p className="text-xs text-muted-foreground">projects done</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {projects.filter((p) => p.status === "in-progress").length}
                    </div>
                    <p className="text-xs text-muted-foreground">active projects</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projects</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {project.title}
                            {project.featured && <Badge variant="secondary">Featured</Badge>}
                            <Badge variant="outline">{project.status}</Badge>
                          </CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Messages</h2>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact._id} className={contact.read ? "opacity-75" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {contact.name}
                            {!contact.read && <Badge variant="default">New</Badge>}
                          </CardTitle>
                          <CardDescription>{contact.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {!contact.read && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(contact._id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleDeleteContact(contact._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(contact.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm">{contact.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your admin account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge variant="secondary">Administrator</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
