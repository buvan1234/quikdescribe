import React, { useState } from 'react';
import './ui.css';

const services = [
  'Lambda', 'S3', 'EC2', 'CloudFront', 'CloudFormation',
  'CloudWatch', 'CodeBuild', 'CodeDeploy'
];

const AwsServiceFinder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const matches = services.filter(service =>
    service.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSearchValue('');
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <div className={`app ${selectedService ? 'details-mode' : 'search-mode'}`}>
      <button className="mode-toggle" onClick={() => document.body.classList.toggle('dark')}>🌓</button>

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
              <button onClick={() => showContent('image')}>🖼️ Image</button>
              <button onClick={() => showContent('description')}>📄 Description</button>
              <button onClick={() => showContent('workflow')}>🔁 Workflow</button>
            </div>
            <div className="content-area" id="contentArea">
              <p className="placeholder">Choose an option on the left to view details.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function showContent(type) {
  const contentArea = document.getElementById('contentArea');
  const selectedService = document.querySelector('.heading').textContent;

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

  if (type === "image") {
    const imgSrc = serviceIcons[selectedService] || "https://via.placeholder.com/400x200";
    contentArea.innerHTML = `<img src="${imgSrc}" alt="${selectedService}" style="max-width:100%; border-radius:8px;">`;
  } else if (type === "description") {
    const message = `${selectedService} is an AWS service that helps you build, scale, and manage cloud apps.`;
    typingEffect(message);
  } else if (type === "workflow") {
    contentArea.innerHTML = `
      <ul>
        <li>🔧 Setup ${selectedService}</li>
        <li>⚙️ Configure Resources</li>
        <li>🚀 Deploy and Monitor</li>
      </ul>`;
  }
}

function typingEffect(text) {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = `<p id="type" class="typing-text"></p>`;
  const target = document.getElementById("type");

  let i = 0;
  const speed = 40;

  function typeChar() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  }

  typeChar();
}

export default AwsServiceFinder;
