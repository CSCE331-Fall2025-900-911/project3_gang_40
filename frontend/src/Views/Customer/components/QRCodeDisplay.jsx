import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeDisplay = ({ url, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Generate QR code
      QRCode.toCanvas(
        canvasRef.current,
        url || window.location.href,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [url, size]);

  return (
    <div className="qr-code-container">
      <canvas ref={canvasRef} className="qr-code-canvas" />
      <p className="qr-code-text">Scan to open on mobile</p>
    </div>
  );
};

export default QRCodeDisplay;