import React from 'react';
import Link from 'next/link';
import { Button, TextField, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import UploadDocument from '@/components/UploadDocument';

type DocumentActionsProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  loading: boolean;
  handleUpload: () => Promise<void>;
  isUploadDisabled: boolean;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDocuments: string[];
  handleBulkDelete: () => void;
};

const DocumentActions: React.FC<DocumentActionsProps> = ({
  fileInputRef,
  setFile,
  loading,
  handleUpload,
  isUploadDisabled,
  searchQuery,
  handleSearchChange,
  selectedDocuments,
  handleBulkDelete,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between space-x-4">
      <Link href="/">
        <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
          <ArrowBack />
          <span>Library</span>
        </Box>
      </Link>
      <UploadDocument
        fileInputRef={fileInputRef}
        setFile={setFile}
        loading={loading}
        handleUpload={handleUpload}
        isUploadDisabled={isUploadDisabled}
      />
      <TextField
        variant="outlined"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={handleSearchChange}
        size="small"
        aria-label="Search documents"
      />
      <Button
        variant="contained"
        color="error"
        disabled={!selectedDocuments.length || loading}
        onClick={handleBulkDelete}
      >
        {`Delete ${selectedDocuments.length} Selected`}
      </Button>
    </div>
  );
};

export default DocumentActions;
