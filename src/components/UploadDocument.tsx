'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import Modal from '@/components/common/Modal'; // Import the new Modal component

import { handleError } from '@/utils';

type UploadDocumentsProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setFile: (f: File | null) => void;
  loading: boolean;
  handleUpload: () => Promise<void>;
  isUploadDisabled: boolean;
};

const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  fileInputRef,
  setFile,
  loading,
  handleUpload,
  isUploadDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFile(null); // Reset file input when modal is closed
  };

  const handleUploadWithClose = async () => {
    try {
      await handleUpload(); // Perform the upload
      handleCloseModal(); // Close the modal on success
    } catch (error: unknown) {
      handleError(error, 'Error uploading document');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <div>
      {/* Trigger Button */}
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Upload Documents
      </Button>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Upload File"
        loading={loading}
        actions={
          <>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadWithClose}
              disabled={isUploadDisabled}
            >
              {' '}
              {loading ? (
                <CircularProgress size={24} color="warning" />
              ) : (
                'Upload'
              )}
            </Button>
          </>
        }
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border rounded mt-2 px-4 py-2 w-full"
        />
      </Modal>
    </div>
  );
};

export default UploadDocuments;
