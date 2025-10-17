import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
export default function QRDisplay({ url, size=160 }){
  const canvasRef = useRef(null);
  useEffect(()=>{ if(!url) return; QRCode.toCanvas(canvasRef.current, url, { width: size }).catch(console.error); }, [url,size]);
  return <canvas ref={canvasRef} className="border p-1 rounded" />;
}
