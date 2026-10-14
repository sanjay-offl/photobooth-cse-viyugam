import QRCode from 'qrcode';

export async function generateQRCodeDataURL(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'H',
  });
}

export async function generateQRCodeSVG(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'H',
  });
}
