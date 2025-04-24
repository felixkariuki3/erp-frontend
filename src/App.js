import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  const industries = ['manufacturing', 'retail', 'services', 'distribution'];
  const deployments = ['cloud', 'on-premise', 'hybrid'];
  const localizations = ['yes', 'no'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">ERP Selector</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <select name="industry" value={formData.industry} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="">Select industry</option>
              {industries.map((i) => (<option key={i} value={i}>{i}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Size</label>
            <input name="companySize" value={formData.companySize} onChange={handleChange} placeholder="e.g. 100" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pain Points</label>
            <input name="painPoints" value={formData.painPoints} onChange={handleChange} placeholder="e.g. Too costly, manual reporting" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Modules Needed</label>
            <input name="modules" value={formData.modules} onChange={handleChange} placeholder="e.g. Finance, CRM" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deployment</label>
            <select name="deployment" value={formData.deployment} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="">Select deployment</option>
              {deployments.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. 20000" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Need Localization?</label>
            <select name="localization" value={formData.localization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="">Select</option>
              {localizations.map((l) => (<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current System</label>
            <input name="currentSystem" value={formData.currentSystem} onChange={handleChange} placeholder="e.g. QuickBooks, SAP" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Get Recommendation</button>
        </form>
        {recommendation && (
          <div className="mt-6 p-4 border rounded bg-green-50 border-green-400">
            <h3 className="text-xl font-semibold text-green-700">Recommended ERP: {recommendation.erp}</h3>
            <p className="text-gray-700 mt-2">{recommendation.reason}</p>
            <p className="text-sm font-semibold text-green-800 mt-2">Estimated Quote: {recommendation.quote}</p>
            <button onClick={generatePDF} className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
