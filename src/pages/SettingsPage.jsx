import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../context/AuthContext';
import {
  KeyIcon,
  EnvelopeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

const SettingsPage = () => {
  const { user, useUserData } = useAuth();
  const queryClient = useQueryClient();
  const { data: userData } = useUserData();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const { error } = await supabase.rpc('change_user_password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSuccessMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: async (newEmail) => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSuccessMessage('Email update verification sent to your new email');
      setNewEmail('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  // Update username mutation
  const updateUsernameMutation = useMutation({
    mutationFn: async (newUsername) => {
      const { data, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .neq('id', user.id)
        .single();

      if (data) throw new Error('Username already taken');
      if (checkError) throw checkError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      setSuccessMessage('Username updated successfully');
      setNewUsername('');
      queryClient.invalidateQueries(['userData']);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    updateEmailMutation.mutate(newEmail);
  };

  const handleUsernameUpdate = (e) => {
    e.preventDefault();
    updateUsernameMutation.mutate(newUsername);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Responsive container with max widths for different screen sizes */}
        <div className="max-w-3xl mx-auto">
          {/* Header with responsive text size */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
            Account Settings
          </h1>

          {/* Alerts - Full width on mobile, with responsive padding */}
          {successMessage && (
            <div className="mb-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-green-700 text-sm md:text-base">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm md:text-base">{errorMessage}</span>
            </div>
          )}

          {/* Settings sections with responsive spacing and sizing */}
          <div className="space-y-4 md:space-y-6">
            {/* Password Update Section */}
            <div className="bg-white shadow rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <KeyIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                Change Password
              </h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Email Update Section */}
            <div className="bg-white shadow rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                Change Email
              </h2>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Update Email
                </button>
              </form>
            </div>

            {/* Username Update Section */}
            <div className="bg-white shadow rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                Change Username
              </h2>
              <form onSubmit={handleUsernameUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Username
                  </label>
                  <input
                    type="text"
                    value={userData?.username}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm md:text-base shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Update Username
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;