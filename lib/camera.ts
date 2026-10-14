'use client';

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type CameraError =
  | 'permission-denied'
  | 'not-found'
  | 'not-supported'
  | 'unknown';

export async function getCameraDevices(): Promise<CameraDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((d) => d.kind === 'videoinput')
    .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Camera ${i + 1}` }));
}

export async function startCamera(
  videoEl: HTMLVideoElement,
  deviceId?: string,
  preferFront = true
): Promise<MediaStream> {
  const facingMode = preferFront ? 'user' : 'environment';
  const constraints: MediaStreamConstraints = {
    video: deviceId
      ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      : { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}

export function stopCamera(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((t) => t.stop());
}

export function captureFrame(
  videoEl: HTMLVideoElement,
  mirror = true
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth || 1280;
  canvas.height = videoEl.videoHeight || 720;
  const ctx = canvas.getContext('2d')!;

  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function getCameraErrorType(err: unknown): CameraError {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return 'permission-denied';
    if (err.name === 'NotFoundError') return 'not-found';
  }
  if (!navigator.mediaDevices) return 'not-supported';
  return 'unknown';
}
