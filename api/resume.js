import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || 'Unknown';
  const city = req.headers['x-vercel-ip-city'] || 'Unknown';
  const region = req.headers['x-vercel-ip-country-region'] || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const referer = req.headers['referer'] || 'Direct';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Resume Tracker <resume@send.seferunuvar.com>',
        to: 'sefer@seferunuvar.com',
        subject: 'Someone downloaded your CV',
        html: `
          <h2>CV Download Notification</h2>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Referer:</strong> ${referer}</p>
          <p><strong>User Agent:</strong> ${userAgent}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `
      })
    });
  } catch (error) {
    console.error('Resend error:', error);
  }

  try {
    const filePath = path.join(process.cwd(), 'Sefer-Unuvar-CV.pdf');
    const fileBuffer = await readFile(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Sefer-Unuvar-CV.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('PDF read error:', error);
    res.status(500).send('CV file could not be downloaded.');
  }
}
