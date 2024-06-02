// DocumentPage.js
import React from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentView from './DocumentView';
import './DocumentPage.css';

function DocumentPage() {
  return (
    <div className="document-page">
      <h1 className="header">Documente de studiu</h1>
      <div className="view-documents-section">
        <DocumentView />
      </div>
      <div className="upload-section">
        <DocumentUpload />
      </div>
    </div>
  );
}

export default DocumentPage;
