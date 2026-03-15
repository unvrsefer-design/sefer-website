export default async function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || 'Unknown';
  const city = req.headers['x-vercel-ip-city'] || 'Unknown';
  const region = req.headers['x-vercel-ip-country-region'] || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const referer = req.headers['referer'] || 'Direct';

  const payload = {
    from: 'Resume Tracker <onboarding@resend.dev>',
    to: 'sefer@seferunuvar.com',
    subject: 'Resume downloaded',
    html: `
      <h2>Someone downloaded your CV</h2>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Region:</strong> ${region}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Referer:</strong> ${referer}</p>
      <p><strong>User Agent:</strong> ${userAgent}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `,
  };

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }

  res.writeHead(302, { Location: '/Sefer-Unuvar-CV.pdf' });
  res.end();
}
