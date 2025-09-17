'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Shelf from '@/components/Shelf';
import AddNewTopic from '@/components/AddNewTopic';
import LoadingBookIndicator from '@/components/common/LoadingBookIndicator';

import { useServices } from '@/services';
import { handleNavigate, handleError } from '@/utils';

const Library: React.FC = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { fetchGroups } = useServices();

  useEffect(() => {
    // Call the API route to create the table
    fetch('/api/init-table');
  }, []);

  useEffect(() => {
    const fetchGroupsList = async () => {
      setLoading(true);
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error: unknown) {
        handleError(error, 'Error fetching groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupsList();
  }, [fetchGroups]);

  const handleTopicSelect = useCallback(
    (group: string) => {
      handleNavigate(router, `/documents?group=${group}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold mb-4">Library</h1>
          <AddNewTopic
            groups={groups}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        {loading ? (
          <LoadingBookIndicator />
        ) : (
          <Shelf groups={groups} handleTopicSelect={handleTopicSelect} />
        )}
      </div>
    </div>
  );
};

export default Library;
