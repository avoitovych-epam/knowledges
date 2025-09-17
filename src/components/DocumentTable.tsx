import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Button,
} from '@mui/material';

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

type DocumentTableProps = {
  documents: Document[];
  selectedDocuments: string[];
  loading: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
};

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  selectedDocuments,
  loading,
  onSelectAll,
  onSelectOne,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedDocuments.length > 0 &&
                  selectedDocuments.length < documents.length
                }
                checked={
                  documents.length > 0 &&
                  selectedDocuments.length === documents.length
                }
                onChange={(e) => onSelectAll(e.target.checked)}
                inputProps={{ 'aria-label': 'select all documents' }}
              />
            </TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onChange={(e) => onSelectOne(doc.id, e.target.checked)}
                  inputProps={{ 'aria-label': `select document ${doc.title}` }}
                />
              </TableCell>
              <TableCell>{doc.title}</TableCell>
              <TableCell>
                <div className="flex justify-center items-center space-x-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Read
                  </a>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => onDelete(doc.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentTable;
