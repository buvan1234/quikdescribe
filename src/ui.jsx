import React, { useState, useEffect } from 'react';
import './ui.css';
import { get } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

const services = [
  'Lambda', 'S3', 'EC2', 'CloudFront', 'CloudFormation',
  'CloudWatch', 'CodeBuild', 'CodeDeploy'
];

const serviceIcons = {
  Lambda: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  S3: "https://miro.medium.com/v2/resize:fit:1160/0*LKTVzkrnf9KU13Bs",
  EC2: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  CloudFront: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  CloudFormation: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  CloudWatch: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  CodeBuild: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  CodeDeploy: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
};

const AwsServiceFinder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [description, setDescription] = useState('');

  const matches = services.filter(service =>
    service.toLowerCase().includes(searchValue.toLowerCase())
  );

  async function getTodo(serviceName) {
    try {
      console.log("Calling API with:", serviceName);
      const restOperation = get({
        apiName: 'quikdecrib',
        path: '/items',
        options: {
          queryParams: {
            param: serviceName
          }
        }
      });
      const { body } = await restOperation.response;  
      const json = await body.json();
      console.log('GET call succeeded: ', json); 
      setDescription(json.results[0].outputText);
    } catch (e) {
      console.log('GET call failed: ', 'Maybe the API is down,The service name is invalid,You have a network issue');

    }
  }

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSearchValue('');
    setContentType('');
    setDescription('');
    setTypedText('');
    getTodo(service); // Call API with selected service
  };

  const handleBack = () => {
    setSelectedService(null);
    setTypedText('');
    setDescription('');
    setContentType(null);
  };

  useEffect(() => {
    if (contentType === 'description' && description) {
      let i = 0;
      const speed = 30;

      function typeChar() {
        if (i < description.length) {
          setTypedText(prev => prev + description.charAt(i));
          i++;
          setTimeout(typeChar, speed);
        }
      }

      typeChar();
    }
  }, [contentType, description]);

  return (
    <div className={`app ${selectedService ? 'details-mode' : 'search-mode'}`}>

      {!selectedService ? (
        <div id="main" className="page search-page active">
          <div className="card">
            <h1 className="centered">Find a Service</h1>
            <input
              type="text"
              id="searchBox"
              placeholder="Search AWS services..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue.trim() && (
              <div id="suggestions">
                {matches.length > 0 ? (
                  matches.map(service => (
                    <div key={service} onClick={() => handleSelectService(service)}>
                      {service}
                    </div>
                  ))
                ) : (
                  <div className="no-match">No matches found</div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="details" className="page details-page active">
          <div className="top-bar">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h2 className="heading">{selectedService}</h2>
          </div>
          <div className="detail-container">
            <div className="sidebar">
              <button onClick={() => setContentType('image')}>🖼️ Image</button>
              <button onClick={() => setContentType('description')}>📄 Description</button>
              <button onClick={() => setContentType('workflow')}>🔁 Workflow</button>
            </div>
            <div className="content-area">
              {contentType === 'image' && (
                <img
                  src={serviceIcons[selectedService] || 'https://via.placeholder.com/400x200'}
                  alt={selectedService}
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              )}
              {contentType === 'description' && (
                <p className="typing-text">{typedText}</p>
              )}
              {contentType === 'workflow' && (
                <ul>
                  <li>🔧 Setup {selectedService}</li>
                  <li>⚙️ Configure Resources</li>
                  <li>🚀 Deploy and Monitor</li>
                </ul>
              )}
              {!contentType && (
                <p className="placeholder">Choose an option on the left to view details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwsServiceFinder;
