// AwsServiceFinder.jsx
import React, { useState, useEffect } from 'react';
import './ui.css';
import { get } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import DOMPurify from 'dompurify';

Amplify.configure(amplifyconfig);

const AwsServiceFinder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [typedText, setTypedText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setSearchValue('');
    setDescription('');
    setTypedText('');
  };

  async function getTodo(serviceName) {
    setLoading(true);
    try {
      const restOperation = get({ 
        apiName: 'quikdecrib',
        path: '/items',
        options: { queryParams: { param: serviceName } }
      });
      const { body } = await restOperation.response;
      const json = await body.json();

      const cleanHTML = DOMPurify.sanitize(json.results[0].outputText);
      setDescription(cleanHTML);
    } catch (e) {
      console.error('GET call failed:', e);
      setDescription('<p style="color:red;">Error fetching description.</p>');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setTypedText('');
      setDescription('');
      getTodo(searchValue.trim());
    }
  };

  useEffect(() => {
    if (description) {
      let i = 0;
      const speed = 1;

      function typeChar() {
        if (i < description.length) {
          setTypedText(prev => prev + description.charAt(i));
          i++;
          setTimeout(typeChar, speed);
        }
      }

      typeChar();
    }
  }, [description]);

  return (
    <div className="single-page-layout">
      <div className="top-section">
        <h1 className="centered">Describe anything</h1>
        <button className="refresh-button" onClick={resetState}>⟳ Reset</button>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type for description"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit">🔍 Describe</button>
        </form>
      </div>

      <div className="detail-section">
        {loading && <p>Loading...</p>}
        {typedText && (
          <div
            className="typing-text"
            dangerouslySetInnerHTML={{ __html: typedText }}
          />
        )}
      </div> 
    </div>
  );
};

export default AwsServiceFinder;
