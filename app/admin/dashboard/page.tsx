'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Users, FileText, Clock } from 'lucide-react';
import AppLayout from '../../../components/AppLayout';

interface UserStats {
  total_users: number;
  total_notes: number;
  active_users: number;
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  is_admin: boolean;
  created_at: string;
  last_sign_in: string | null;
  note_count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    total_notes: 0,
    active_users: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof UserProfile>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([
          fetchStats(),
          fetchUsers()
        ]);
      } catch (error) {
        console.error('AdminDashboard: Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get total notes
      const { count: totalNotes, error: notesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });

      if (notesError) throw notesError;

      // Get active users (users who have created notes in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsersData, error: activeError } = await supabase
        .from('notes')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (activeError) throw activeError;

      // Count unique users who created notes in the last 30 days
      const activeUsers = new Set(activeUsersData?.map(note => note.user_id)).size;

      setStats({
        total_users: totalUsers || 0,
        total_notes: totalNotes || 0,
        active_users: activeUsers,
      });
    } catch (error) {
      console.error('AdminDashboard: Error fetching stats:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      // First fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profilesData) {
        throw new Error('No users data returned');
      }

      // Get all notes with their user_ids
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('user_id');

      if (notesError) throw notesError;

      // Count notes per user
      const noteCountMap = new Map<string, number>();
      notesData?.forEach(note => {
        if (note.user_id) {
          const currentCount = noteCountMap.get(note.user_id) || 0;
          noteCountMap.set(note.user_id, currentCount + 1);
        }
      });

      // Transform the data to include note count
      const transformedData = profilesData.map(profile => ({
        ...profile,
        note_count: noteCountMap.get(profile.id) || 0
      }));

      setUsers(transformedData);
    } catch (error) {
      console.error('AdminDashboard: Error fetching users:', error);
      throw error;
    }
  };

  const handleSort = (field: keyof UserProfile) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === null) return sortDirection === 'asc' ? 1 : -1;

    // Handle boolean values
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection === 'asc' 
        ? (aValue === bValue ? 0 : aValue ? -1 : 1)
        : (aValue === bValue ? 0 : aValue ? 1 : -1);
    }

    // Handle date values
    if (sortField === 'created_at' || sortField === 'last_sign_in') {
      const dateA = typeof aValue === 'string' ? new Date(aValue).getTime() : 0;
      const dateB = typeof bValue === 'string' ? new Date(bValue).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // Handle number values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const filteredAndSortedUsers = sortedUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const displayName = user.display_name?.toLowerCase() || '';
    const username = user.username?.toLowerCase() || '';
    return displayName.includes(searchLower) || username.includes(searchLower);
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">{stats.total_users}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Notes</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">{stats.total_notes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Active Users (30d)</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">{stats.active_users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th 
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('display_name')}
                  >
                    Name {sortField === 'display_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('note_count')}
                  >
                    Notes {sortField === 'note_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('last_sign_in')}
                  >
                    Last Sign In {sortField === 'last_sign_in' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div className="font-medium">{user.display_name || 'Unnamed User'}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{user.username || 'No username'}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.note_count}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 