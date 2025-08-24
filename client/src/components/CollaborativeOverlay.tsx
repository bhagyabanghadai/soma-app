import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X,
  Send,
  Eye,
  MapPin,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastActivity: string;
  currentLocation?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  location: string;
  createdBy: string;
  createdAt: string;
  updates: TaskUpdate[];
}

interface TaskUpdate {
  id: string;
  taskId: string;
  message: string;
  author: string;
  timestamp: string;
  type: 'comment' | 'status_change' | 'assignment';
}

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'user_joined' | 'field_update' | 'alert';
  message: string;
  author: string;
  timestamp: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface CollaborativeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborativeOverlay = ({ isOpen, onClose }: CollaborativeOverlayProps) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'tasks' | 'team' | 'chat'>('activity');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    location: '',
    dueDate: ''
  });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isOpen) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Collaborative overlay WebSocket connected');
        // Send join message
        wsRef.current?.send(JSON.stringify({
          type: 'join_collaboration',
          data: { userId: 'current_user', farmId: 'main_farm' }
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Collaborative WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('Collaborative WebSocket disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }

    return () => {
      wsRef.current?.close();
    };
  }, [isOpen]);

  // Initialize mock data
  useEffect(() => {
    if (!isOpen) return;

    // Mock team members
    setTeamMembers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@farm.com',
        role: 'Farm Manager',
        isOnline: true,
        lastActivity: new Date().toISOString(),
        currentLocation: 'North Field'
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        email: 'mike@farm.com',
        role: 'Field Worker',
        isOnline: true,
        lastActivity: new Date(Date.now() - 5 * 60000).toISOString(),
        currentLocation: 'Equipment Barn'
      },
      {
        id: '3',
        name: 'Emma Chen',
        email: 'emma@farm.com',
        role: 'Agronomist',
        isOnline: false,
        lastActivity: new Date(Date.now() - 2 * 3600000).toISOString()
      }
    ]);

    // Mock tasks
    setTasks([
      {
        id: 't1',
        title: 'Irrigation System Check',
        description: 'Inspect irrigation lines in North Field for winter damage',
        assignedTo: '2',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date().toISOString(),
        location: 'North Field',
        createdBy: '1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updates: []
      },
      {
        id: 't2',
        title: 'Soil Testing',
        description: 'Collect soil samples from South Field for pH analysis',
        assignedTo: '3',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        location: 'South Field',
        createdBy: '1',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updates: []
      }
    ]);

    // Mock activities
    setActivities([
      {
        id: 'a1',
        type: 'task_completed',
        message: 'Mike completed "Equipment Maintenance" task',
        author: 'Mike Rodriguez',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        location: 'Equipment Barn'
      },
      {
        id: 'a2',
        type: 'field_update',
        message: 'Sarah updated soil moisture readings in North Field',
        author: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        location: 'North Field'
      },
      {
        id: 'a3',
        type: 'alert',
        message: 'Low water pressure detected in irrigation Zone 3',
        author: 'System',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        location: 'Zone 3',
        priority: 'high'
      }
    ]);

    // Mock chat messages
    setChatMessages([
      {
        id: 'c1',
        message: 'Irrigation system in North Field is running smoothly after the repairs',
        author: 'Mike Rodriguez',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 'c2',
        message: 'Great work! How are the pressure readings looking?',
        author: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 'c3',
        message: 'All zones showing optimal pressure. Zone 3 issue is resolved.',
        author: 'Mike Rodriguez',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ]);
  }, [isOpen]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'new_activity':
        setActivities(prev => [message.data, ...prev].slice(0, 50));
        break;
      case 'task_update':
        setTasks(prev => prev.map(task => 
          task.id === message.data.id ? message.data : task
        ));
        break;
      case 'new_chat_message':
        setChatMessages(prev => [...prev, message.data]);
        break;
      case 'user_presence':
        setTeamMembers(prev => prev.map(member =>
          member.id === message.data.userId 
            ? { ...member, isOnline: message.data.isOnline, currentLocation: message.data.location }
            : member
        ));
        break;
    }
  };

  const sendWebSocketMessage = (type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `c${Date.now()}`,
      message: newMessage,
      author: 'You',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    sendWebSocketMessage('chat_message', message);
    setNewMessage('');
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: `t${Date.now()}`,
      ...newTask,
      status: 'pending',
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
      updates: []
    };

    setTasks(prev => [task, ...prev]);
    sendWebSocketMessage('new_task', task);
    
    // Add activity
    const activity: Activity = {
      id: `a${Date.now()}`,
      type: 'task_created',
      message: `New task created: "${task.title}"`,
      author: 'You',
      timestamp: new Date().toISOString(),
      location: task.location
    };
    setActivities(prev => [activity, ...prev]);

    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      location: '',
      dueDate: ''
    });
    setShowNewTaskForm(false);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    const updatedTask = tasks.find(t => t.id === taskId);
    if (!updatedTask) return;

    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));

    sendWebSocketMessage('task_status_update', { taskId, status });

    // Add activity
    const activity: Activity = {
      id: `a${Date.now()}`,
      type: status === 'completed' ? 'task_completed' : 'field_update',
      message: `Task "${updatedTask.title}" status changed to ${status}`,
      author: 'You',
      timestamp: new Date().toISOString(),
      location: updatedTask.location
    };
    setActivities(prev => [activity, ...prev]);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Farm Collaboration Center</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">{teamMembers.filter(m => m.isOnline).length} online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className="flex items-center gap-2"
            >
              {notifications ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b">
          {[
            { id: 'activity', label: 'Live Activity', icon: Bell },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'chat', label: 'Chat', icon: MessageCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'activity' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'alert' ? 'bg-red-500' :
                      activity.type === 'task_completed' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{activity.author}</span>
                        <span>•</span>
                        <span>{formatTime(activity.timestamp)}</span>
                        {activity.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </div>
                          </>
                        )}
                        {activity.priority && (
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Active Tasks</h3>
                <Button onClick={() => setShowNewTaskForm(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </div>

              {showNewTaskForm && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Task description..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="task-assigned">Assign To</Label>
                        <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="task-location">Location</Label>
                        <Input
                          id="task-location"
                          value={newTask.location}
                          onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Field or area"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateTask}>Create Task</Button>
                      <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {tasks.map(task => {
                  const assignedMember = teamMembers.find(m => m.id === task.assignedTo);
                  return (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {task.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              {assignedMember && (
                                <div className="flex items-center gap-1">
                                  <Avatar className="w-4 h-4">
                                    <AvatarFallback className="text-xs">
                                      {assignedMember.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  {assignedMember.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {task.status === 'pending' && (
                              <Button size="sm" onClick={() => updateTaskStatus(task.id, 'in-progress')}>
                                Start
                              </Button>
                            )}
                            {task.status === 'in-progress' && (
                              <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="h-full overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h3>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>{member.isOnline ? 'Online' : `Last seen ${formatTime(member.lastActivity)}`}</span>
                            {member.currentLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {member.currentLocation}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map(message => (
                  <div key={message.id} className={`flex gap-3 ${message.author === 'You' ? 'justify-end' : ''}`}>
                    {message.author !== 'You' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {message.author.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.author === 'You' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.author !== 'You' && (
                        <p className="text-xs font-medium mb-1">{message.author}</p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.author === 'You' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.author === 'You' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-green-600 text-white">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeOverlay;