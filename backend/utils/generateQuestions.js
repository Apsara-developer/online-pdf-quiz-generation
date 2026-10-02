function cleanText(text) {
  return text
    .replace(/\r/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 45);
}

function makeOptions(answer, sentenceIndex) {
  const generic = [
    "None of these",
    "Not mentioned",
    "All of these",
    "Another concept"
  ];

  const options = [answer];

  for (let i = 0; i < generic.length && options.length < 4; i++) {
    if (generic[i].toLowerCase() !== answer.toLowerCase()) {
      options.push(generic[i]);
    }
  }

  // Rotate the correct answer so it is not always option A.
  const rotation = sentenceIndex % 4;
  return options.map((_, index) => options[(index + rotation) % options.length]);
}

function findImportantPhrase(sentence) {
  const patterns = [
    /\b(?:is|are|was|were|means|refers to|known as|called)\s+([^,.;!?]+)/i,
    /\b(?:uses|used|contains|includes|consists of|has)\s+([^,.;!?]+)/i
  ];

  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match && match[1]) {
      const phrase = match[1].trim();

      if (phrase.length >= 3 && phrase.length <= 80) {
        return phrase;
      }
    }
  }

  const words = sentence
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 5);

  if (words.length > 0) {
    return words[Math.floor(words.length / 2)];
  }

  return null;
}

function createQuestion(sentence, index) {
  const answer = findImportantPhrase(sentence);

  if (!answer) {
    return null;
  }

  const escapedAnswer = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const questionText = sentence.replace(
    new RegExp(escapedAnswer, "i"),
    "________"
  );

  if (questionText === sentence) {
    return {
      question: `According to the uploaded PDF, which phrase is associated with this statement?\n\n${sentence}`,
      options: makeOptions(answer, index),
      answer
    };
  }

  return {
    question: `Fill in the missing information:\n\n${questionText}`,
    options: makeOptions(answer, index),
    answer
  };
}

function generateQuestions(text, requestedCount = 5) {
  const sentences = splitIntoSentences(text);
  const questions = [];

  for (let i = 0; i < sentences.length && questions.length < requestedCount; i++) {
    const question = createQuestion(sentences[i], i);

    if (question) {
      questions.push(question);
    }
  }

  return questions;
}

module.exports = {
  generateQuestions
};
