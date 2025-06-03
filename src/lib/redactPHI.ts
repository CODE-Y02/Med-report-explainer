// --- PHI Redaction (Basic Implementation) ---
const PHI_PATTERNS = [
  // Names (very basic - could be improved with more sophisticated NLP)
  {
    regex: /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/g,
    replacement: "",
  },
  // Dates (various formats)
  {
    regex: /\b\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2}|\d{4}\b/g,
    replacement: "",
  },
  {
    regex:
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}\b/gi,
    replacement: "",
  },
  // Social Security Numbers (SSN-like patterns)
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "" },
  // Phone Numbers (North American format, basic)
  {
    regex: /\b\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    replacement: "",
  },
  // Addresses (very basic)
  {
    regex:
      /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd)\b/gi,
    replacement: "",
  },
  // Email Addresses
  {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: "",
  },
  // Medical Record Numbers (MRN) - example pattern, highly variable
  { regex: /\bMRN[:\s]*[A-Za-z0-9\-]+/gi, replacement: "" },
];

function redactPHI(text: string): string {
  let redactedText = text;
  PHI_PATTERNS.forEach((pattern) => {
    redactedText = redactedText.replace(pattern.regex, pattern.replacement);
  });
  return redactedText;
}

export default redactPHI;
