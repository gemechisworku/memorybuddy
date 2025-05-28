'use client'

import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/AppLayout'
import { Shield, Mail, Key, Clock } from 'lucide-react'

export default function AccountPage() {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.email?.split('@')[0]}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email Address</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Key className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Account ID</p>
                    <p className="mt-1 text-sm font-mono text-gray-500 dark:text-gray-400">{user?.id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Last Sign In</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Account Status</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account is active and in good standing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 