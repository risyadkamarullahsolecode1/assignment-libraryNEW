import React, {useState} from "react";
import apiClient from "../../axiosConfig";

const Report = () => {
    const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setPdfFile(null);

   try {
      const response = await apiClient.get('/Book/report', {
         responseType: 'blob'
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfFile(pdfUrl);

    } catch (err) {
      setError('Gagal menghasilkan laporan. Silakan coba lagi.'); 
    } finally {
      setIsLoading(false);
    }
};

const handleDownloadPDF = () => {
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.setAttribute('download', `Laporan_book.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
};

return(
    <div className="container">
       <h4>Laporan Buku Keluar</h4>
          {error && (
            <div className="alert alert-danger" role="alert">{error}</div>
          )}

          <div className="text-center mb-3">
            <button className="btn btn-primary me-2" 
              onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? 'Menghasilkan Laporan...' : 'Lihat Laporan'}
            </button>
            {pdfFile && (
             <button className="btn btn-success" onClick={handleDownloadPDF}>Unduh PDF</button>
            )}
          </div>

          {/* Preview PDF */}
          {pdfFile && (
              <div className="embed-responsive embed-responsive-16by9">
               <iframe src={pdfFile} width="100%" height="500" className="embed-responsive-item">
               Browser Anda tidak mendukung tampilan PDF.</iframe>
              </div>
          )}
        </div>   
);
};

export default Report;