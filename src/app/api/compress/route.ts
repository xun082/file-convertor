import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  console.log(req);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Buffer created, size:', buffer.length);

    const compressedBuffer = await sharp(buffer).resize(1920).jpeg({ quality: 80 }).toBuffer();

    console.log('Image compressed, size:', compressedBuffer.length);

    const response = new NextResponse(compressedBuffer);
    response.headers.set('Content-Type', 'image/jpeg');
    response.headers.set('Content-Disposition', 'attachment; filename=compressed_image.jpg');

    return response;
  } catch (error) {
    console.error('Failed to compress image:', error);
    return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 });
  }
}
