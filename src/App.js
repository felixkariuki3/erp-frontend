import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    industry: '',
    companySize: '',
    painPoints: '',
    modules: '',
    deployment: '',
    budget: '',
    localization: '',
    currentSystem: ''
  });

  const [recommendation, setRecommendation] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const result = await response.json();
  setRecommendation(result);
};

const generatePDF = () => {
  if (!recommendation || !recommendation.erp) {
    alert("Please submit the form and wait for a recommendation before downloading the PDF.");
    return;
  }

  const doc = new jsPDF();
  doc.text('ERP Recommendation Report', 14, 16);
  doc.autoTable({
    startY: 25,
    head: [['Field', 'Value']],
    body: Object.entries(formData).map(([key, value]) => [key, value])
  });
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['ERP', 'Reason', 'Quote']],
    body: [[recommendation.erp, recommendation.reason, recommendation.quote]]
  });
  doc.save('erp-recommendation.pdf');
};


  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
      <h2>ERP Selector</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            name={key}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            value={value}
            onChange={handleChange}
          />
        ))}
        <button type="submit">Get Recommendation</button>
      </form>
      {recommendation && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Recommended ERP: {recommendation.erp}</h3>
          <p>{recommendation.reason}</p>
          <p><strong>Estimated Quote:</strong> {recommendation.quote}</p>
        </div>
      )}
    </div>
  );
}

export default App;
