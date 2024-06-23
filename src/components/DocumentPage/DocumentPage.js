import React from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentView from './DocumentView';
import './DocumentPage.css';
import { useAuth } from '../AuthContext';

function DocumentPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="document-page">
      <h1 className="header">Documente de studiu</h1>
      <div className="view-documents-section">
        <DocumentView />
      </div>
      {isAuthenticated && user.role === 'admin' && (
        <div className="upload-section">
          <DocumentUpload />
        </div>
      )}
    </div>
  );
}

export default DocumentPage;
