// components/QrScannerComponent.tsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QrScannerComponent: React.FC = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
      setQrCodeResult(data.text); // เก็บผลลัพธ์ที่แสกนได้
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <h1>แสกน QR Code</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {qrCodeResult && <p>ผลลัพธ์ QR Code: {qrCodeResult}</p>}
    </div>
  );
};

export default QrScannerComponent;
