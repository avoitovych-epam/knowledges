import { useMemo } from 'react';
import { handleError } from '@/utils';

type Document = {
  id: string;
  title: string;
  fileUrl: string;
  group: string;
  created_at: string;
};

type FetchDocumentsResponse = {
  archivesWithUrl: Document[];
  totalPages: number;
};

export const useServices = () => {
  // Fetch documents (implement your own /api/archives route if needed)
  const fetchDocuments = async (
    page: number,
    group?: string,
    search?: string
  ): Promise<FetchDocumentsResponse | null> => {
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: '5',
        ...(group ? { group } : {}),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/archives?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch documents');
      return await res.json();
    } catch (error: unknown) {
      handleError(error, 'Error fetching documents');
      return null;
    }
  };

  // Upload document using /api/upload
  const uploadDocument = async (
    file: File,
    group?: string
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (group) formData.append('group', group);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload document');
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error uploading document');
      return false;
    }
  };

  // Delete document using /api/archives/[id]
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/archives/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document');
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error deleting document');
      return false;
    }
  };

  // Bulk delete using /api/archives/bulk-delete
  const bulkDeleteDocuments = async (ids: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/archives/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Failed to bulk delete documents');
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error bulk deleting documents');
      return false;
    }
  };

  // Fetch groups using /api/groups
  const fetchGroups = async (): Promise<string[]> => {
    try {
      const res = await fetch('/api/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      return await res.json();
    } catch (error: unknown) {
      handleError(error, 'Error fetching groups');
      return [];
    }
  };

  return useMemo(
    () => ({
      fetchDocuments,
      uploadDocument,
      deleteDocument,
      bulkDeleteDocuments,
      fetchGroups,
    }),
    []
  );
};
