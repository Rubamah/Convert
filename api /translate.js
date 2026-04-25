export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text } = req.body;

    // اختبار بسيط
    return res.status(200).json({
      translatedText: "TEST: " + text
    });

  } catch (error) {
    return res.status(500).json({ error: "Server failed" });
  }
}
