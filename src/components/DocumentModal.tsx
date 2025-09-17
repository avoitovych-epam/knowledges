import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import Modal from '@/components/common/Modal';

type DocumentModalProps = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  loading,
  onClose,
  onDelete,
}) => {
  const modalContent = (
    <div className="flex justify-between items-center mt-2 mb-2">
      <h2 className="text-xl font-medium">
        Do you really want to delete this document?
      </h2>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="warning" />
            ) : (
              'Delete'
            )}
          </Button>
        </>
      }
    >
      {modalContent}
    </Modal>
  );
};

export default DocumentModal;
