
/**
 * Utility for text processing and AI writing assistance features
 */

// Grammar check function
export const checkGrammar = (text: string): { corrected: string, issues: string[] } => {
  // This is a simplified mock implementation
  // In a real app, this would use an API or library for grammar checking
  
  const commonErrors = [
    { pattern: /\s+,/g, replacement: "," },
    { pattern: /\s+\./g, replacement: "." },
    { pattern: /\s+;/g, replacement: ";" },
    { pattern: /\s+:/g, replacement: ":" },
    { pattern: /\s+\?/g, replacement: "?" },
    { pattern: /\s+!/g, replacement: "!" },
    { pattern: /\bi\b/g, replacement: "I" },
    { pattern: /\bim\b/g, replacement: "I'm" },
    { pattern: /\bdont\b/g, replacement: "don't" },
    { pattern: /\bwont\b/g, replacement: "won't" },
    { pattern: /\bcant\b/g, replacement: "can't" },
    { pattern: /\bive\b/g, replacement: "I've" },
    { pattern: /\sid\b/g, replacement: " I'd" },
    { pattern: /\bits\b/g, replacement: "it's" },
    { pattern: /\byoure\b/g, replacement: "you're" },
    { pattern: /\btheyre\b/g, replacement: "they're" },
    { pattern: /\btheres\b/g, replacement: "there's" },
    { pattern: /\bweve\b/g, replacement: "we've" },
    { pattern: /\bwouldnt\b/g, replacement: "wouldn't" },
    { pattern: /\bcouldnt\b/g, replacement: "couldn't" },
    { pattern: /\bshouldnt\b/g, replacement: "shouldn't" },
    { pattern: /\bwasnt\b/g, replacement: "wasn't" },
    { pattern: /\bisnt\b/g, replacement: "isn't" },
    { pattern: /\barent\b/g, replacement: "aren't" },
    { pattern: /\bwerent\b/g, replacement: "weren't" },
    { pattern: /\bhasnt\b/g, replacement: "hasn't" },
    { pattern: /\bhavent\b/g, replacement: "haven't" },
    { pattern: /\bwont\b/g, replacement: "won't" },
    { pattern: /\bdidnt\b/g, replacement: "didn't" },
    { pattern: /\baint\b/g, replacement: "isn't" },
    { pattern: /\bgonna\b/g, replacement: "going to" },
    { pattern: /\bwanna\b/g, replacement: "want to" },
    { pattern: /\bgotta\b/g, replacement: "got to" },
  ];
  
  // Detect double spaces
  const doubleSpacePattern = /\s{2,}/g;
  const hasDoubleSpaces = doubleSpacePattern.test(text);
  
  let correctedText = text;
  const issues = [];
  
  // Replace double spaces
  if (hasDoubleSpaces) {
    correctedText = correctedText.replace(doubleSpacePattern, " ");
    issues.push("Multiple spaces detected and corrected");
  }
  
  // Check and fix common grammar issues
  commonErrors.forEach(({ pattern, replacement }) => {
    if (pattern.test(correctedText)) {
      const original = correctedText;
      correctedText = correctedText.replace(pattern, replacement);
      
      if (original !== correctedText) {
        issues.push(`Replaced "${pattern.toString().slice(1, -2)}" with "${replacement}"`);
      }
    }
  });
  
  // Check for sentence capitalization
  const sentencePattern = /(?:^|[.!?]\s+)([a-z])/g;
  if (sentencePattern.test(text)) {
    correctedText = correctedText.replace(sentencePattern, (match, p1) => {
      return match.replace(p1, p1.toUpperCase());
    });
    issues.push("Capitalized sentence beginnings");
  }
  
  return { corrected: correctedText, issues };
};

// Text rewrite functions
type RewriteStyle = "simplify" | "formal" | "shorten";

export const rewriteText = (text: string, style: RewriteStyle): string => {
  // This is a simplified mock implementation
  // In a real app, this would use an API or library for sophisticated text rewriting
  
  switch (style) {
    case "simplify":
      return simplifyText(text);
    case "formal":
      return formalizeText(text);
    case "shorten":
      return shortenText(text);
    default:
      return text;
  }
};

const simplifyText = (text: string): string => {
  // Mock implementation of text simplification
  const complexWords = [
    { complex: /utilize/g, simple: "use" },
    { complex: /implementation/g, simple: "use" },
    { complex: /functionality/g, simple: "features" },
    { complex: /subsequently/g, simple: "then" },
    { complex: /nevertheless/g, simple: "still" },
    { complex: /in order to/g, simple: "to" },
    { complex: /commence/g, simple: "start" },
    { complex: /terminate/g, simple: "end" },
    { complex: /endeavor/g, simple: "try" },
    { complex: /ascertain/g, simple: "find out" },
    { complex: /utilize/g, simple: "use" },
    { complex: /additionally/g, simple: "also" },
    { complex: /regarding/g, simple: "about" },
    { complex: /approximately/g, simple: "about" },
    { complex: /sufficient/g, simple: "enough" },
    { complex: /inquire/g, simple: "ask" },
    { complex: /demonstrate/g, simple: "show" },
    { complex: /numerous/g, simple: "many" },
    { complex: /initiate/g, simple: "start" },
  ];
  
  let simplifiedText = text;
  
  complexWords.forEach(({ complex, simple }) => {
    simplifiedText = simplifiedText.replace(complex, simple);
  });
  
  // Replace long sentences with shorter ones (very simplified approach)
  const longSentencePattern = /([^.!?]+[,;][^.!?]+)([.!?])/g;
  simplifiedText = simplifiedText.replace(longSentencePattern, (match, p1, p2) => {
    // Split into two sentences if possible
    const parts = p1.split(/[,;]/);
    if (parts.length > 1 && parts[0].length > 15 && parts[1].length > 15) {
      return `${parts[0].trim()}${p2} ${parts[1].trim()}${p2}`;
    }
    return match;
  });
  
  return simplifiedText;
};

const formalizeText = (text: string): string => {
  // Mock implementation of text formalization
  const informalWords = [
    { informal: /kids/g, formal: "children" },
    { informal: /lots of/g, formal: "numerous" },
    { informal: /get/g, formal: "acquire" },
    { informal: /big/g, formal: "substantial" },
    { informal: /show/g, formal: "demonstrate" },
    { informal: /find out/g, formal: "ascertain" },
    { informal: /look into/g, formal: "investigate" },
    { informal: /try/g, formal: "attempt" },
    { informal: /need/g, formal: "require" },
    { informal: /use/g, formal: "utilize" },
    { informal: /start/g, formal: "commence" },
    { informal: /end/g, formal: "conclude" },
    { informal: /make/g, formal: "produce" },
    { informal: /help/g, formal: "assist" },
    { informal: /stop/g, formal: "cease" },
    { informal: /keep/g, formal: "maintain" },
    { informal: /fix/g, formal: "repair" },
    { informal: /break/g, formal: "damage" },
    { informal: /about/g, formal: "regarding" },
  ];
  
  let formalText = text;
  
  informalWords.forEach(({ informal, formal }) => {
    formalText = formalText.replace(informal, formal);
  });
  
  // Replace contractions
  const contractions = [
    { contraction: /can't/g, full: "cannot" },
    { contraction: /won't/g, full: "will not" },
    { contraction: /don't/g, full: "do not" },
    { contraction: /doesn't/g, full: "does not" },
    { contraction: /didn't/g, full: "did not" },
    { contraction: /isn't/g, full: "is not" },
    { contraction: /aren't/g, full: "are not" },
    { contraction: /wasn't/g, full: "was not" },
    { contraction: /weren't/g, full: "were not" },
    { contraction: /haven't/g, full: "have not" },
    { contraction: /hasn't/g, full: "has not" },
    { contraction: /hadn't/g, full: "had not" },
    { contraction: /I'm/g, full: "I am" },
    { contraction: /you're/g, full: "you are" },
    { contraction: /he's/g, full: "he is" },
    { contraction: /she's/g, full: "she is" },
    { contraction: /it's/g, full: "it is" },
    { contraction: /we're/g, full: "we are" },
    { contraction: /they're/g, full: "they are" },
    { contraction: /I've/g, full: "I have" },
    { contraction: /you've/g, full: "you have" },
    { contraction: /we've/g, full: "we have" },
    { contraction: /they've/g, full: "they have" },
    { contraction: /I'd/g, full: "I would" },
    { contraction: /you'd/g, full: "you would" },
    { contraction: /he'd/g, full: "he would" },
    { contraction: /she'd/g, full: "she would" },
    { contraction: /it'd/g, full: "it would" },
    { contraction: /we'd/g, full: "we would" },
    { contraction: /they'd/g, full: "they would" },
    { contraction: /I'll/g, full: "I will" },
    { contraction: /you'll/g, full: "you will" },
    { contraction: /he'll/g, full: "he will" },
    { contraction: /she'll/g, full: "she will" },
    { contraction: /it'll/g, full: "it will" },
    { contraction: /we'll/g, full: "we will" },
    { contraction: /they'll/g, full: "they will" },
  ];
  
  contractions.forEach(({ contraction, full }) => {
    formalText = formalText.replace(contraction, full);
  });
  
  return formalText;
};

const shortenText = (text: string): string => {
  // Mock implementation of text shortening
  let shortenedText = text;
  
  // Remove unnecessary phrases
  const unnecessaryPhrases = [
    /in order to/g,
    /due to the fact that/g,
    /for the purpose of/g,
    /in the event that/g,
    /in the process of/g,
    /with regard to/g,
    /for the most part/g,
    /in the majority of cases/g,
    /it is important to note that/g,
    /it should be noted that/g,
    /it is worth noting that/g,
    /needless to say/g,
    /as a matter of fact/g,
    /at the present time/g,
    /for all intents and purposes/g,
    /in a manner of speaking/g,
    /in the final analysis/g,
    /in the nature of/g,
    /in the vicinity of/g,
  ];
  
  const replacements = [
    "to",
    "because",
    "for",
    "if",
    "during",
    "about",
    "mostly",
    "usually",
    "",
    "",
    "",
    "",
    "",
    "now",
    "",
    "",
    "finally",
    "like",
    "near",
  ];
  
  for (let i = 0; i < unnecessaryPhrases.length; i++) {
    shortenedText = shortenedText.replace(unnecessaryPhrases[i], replacements[i]);
  }
  
  // Remove redundant adverbs and adjectives (simplified approach)
  const redundantModifiers = [
    /really /g,
    /very /g,
    /extremely /g,
    /actually /g,
    /basically /g,
    /literally /g,
    /definitely /g,
    /certainly /g,
    /absolutely /g,
    /completely /g,
    /totally /g,
    /utterly /g,
    /quite /g,
    /rather /g,
    /somewhat /g,
    /just /g,
    /simply /g,
    /virtually /g,
  ];
  
  redundantModifiers.forEach((modifier) => {
    shortenedText = shortenedText.replace(modifier, "");
  });
  
  return shortenedText;
};
