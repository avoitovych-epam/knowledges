'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Pagination from '@mui/material/Pagination';

import DocumentTable from '@/components/DocumentTable';
import DocumentActions from '@/components/DocumentActions';
import DocumentModal from '@/components/DocumentModal';
import { useServices } from '@/services';
import { handleError } from '@/utils';

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

const Documents: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const debounceSearch = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  const selectedGroup = searchParams.get('group') || '';
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentIdDel, setDocumentIdDel] = useState('');

  const handleOpenModal = (id: string) => {
    setDocumentIdDel(id);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setDocumentIdDel('');
    setIsModalOpen(false);
  };

  const {
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    bulkDeleteDocuments,
  } = useServices();

  const refreshDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchDocuments(
        page,
        selectedGroup || undefined,
        searchQuery
      );
      if (result) {
        setDocuments(result.archivesWithUrl);
        setTotalPages(result.totalPages);
      }
    } catch (error: unknown) {
      handleError(error, 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [page, selectedGroup, searchQuery, fetchDocuments]);

  const handleUpload = async () => {
    if (!file) {
      handleError(new Error('Please select a file to upload'));
      return;
    }
    setLoading(true);
    try {
      const success = await uploadDocument(file, selectedGroup);
      if (success) {
        toast.success('File uploaded successfully');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        refreshDocuments();
      }
    } catch (error: unknown) {
      handleError(error, 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteDocument(id);
      if (success) {
        if (selectedDocuments.includes(id)) {
          setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
        }
        toast.success('Document deleted successfully');
        refreshDocuments();
      }
    } catch (error: unknown) {
      handleError(error, 'Failed to delete document');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedDocuments.length) {
      toast.error('Please select documents to delete.');
      return;
    }
    setLoading(true);
    try {
      const success = await bulkDeleteDocuments(selectedDocuments);
      if (success) {
        toast.success('Documents deleted successfully');
        setSelectedDocuments([]);
        refreshDocuments();
      }
    } catch (error: unknown) {
      handleError(error, 'Failed to delete documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedDocuments(checked ? documents.map((doc) => doc.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedDocuments((prev) =>
      checked ? [...prev, id] : prev.filter((docId) => docId !== id)
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);

    if (debounceSearch.current) {
      clearTimeout(debounceSearch.current);
    }

    debounceSearch.current = setTimeout(() => {
      setSearchQuery(query);

      // Update the URL with the search query after the debounce delay
      const updatedQuery = new URLSearchParams({
        group: selectedGroup || '',
        page: String(page),
        search: query,
      });

      router.replace(`${pathname}?${updatedQuery.toString()}`);
    }, 900); // 300ms debounce delay
  };

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Document Management</h1>
          <h2 className="text-lg">
            Topic: <strong>{selectedGroup}</strong>
          </h2>
        </div>
        <DocumentActions
          fileInputRef={fileInputRef}
          setFile={setFile}
          loading={loading}
          handleUpload={handleUpload}
          isUploadDisabled={loading || !file}
          searchQuery={searchInput}
          handleSearchChange={handleSearchChange}
          selectedDocuments={selectedDocuments}
          handleBulkDelete={handleBulkDelete}
        />
        <DocumentTable
          documents={documents}
          selectedDocuments={selectedDocuments}
          loading={loading}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onDelete={handleOpenModal}
        />
        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
            disabled={loading}
          />
        </div>
      </div>
      <DocumentModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={handleCloseModal}
        onDelete={() => handleDelete(documentIdDel)}
      />
    </div>
  );
};

export default Documents;
