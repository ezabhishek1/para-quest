import { describe, it, expect } from 'vitest';
import { validatePhotoFile, MAX_PHOTO_BYTES } from '../lib/storage/image-handler';

describe('Photo Validation Rules', () => {
  it('approves standard image mime types within size limit', () => {
    const validFile = new File(['image dummy data'], 'nature.jpg', { type: 'image/jpeg' });
    const result = validatePhotoFile(validFile);
    expect(result.valid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const pdfFile = new File(['pdf dummy data'], 'document.pdf', { type: 'application/pdf' });
    const result = validatePhotoFile(pdfFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported image format');
  });

  it('rejects files exceeding 4MB', () => {
    // Mock a large file
    const oversizedFile = {
      name: 'huge.jpg',
      type: 'image/jpeg',
      size: MAX_PHOTO_BYTES + 1024,
    } as File;

    const result = validatePhotoFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});
