import React, { useEffect, useRef } from 'react';

const JDoodleEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Add the JDoodle pym.js script to the document
      const script = document.createElement('script');
      script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        if (window.pym) {
          window.pym.autoInit();
        }
      };

      document.body.appendChild(script);

      // Clean up by removing the script on component unmount
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div ref={editorRef}>
      <div data-pym-src="https://www.jdoodle.com/embed/v1/ddee81b5881bd3a8"></div>
    </div>
  );
};

export default JDoodleEditor;
