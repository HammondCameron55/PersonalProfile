/**
 * Pure vector helpers for in-memory cosine similarity (PRD FR-7 baseline index).
 */

export function cosineSimilarity(a, b) {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export function topKByEmbedding(queryVec, entries, k) {
  if (!queryVec?.length || !entries.length) return [];
  const scored = entries.map((entry, index) => ({
    index,
    score: cosineSimilarity(queryVec, entry.embedding),
    entry,
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, k).filter((s) => s.score > 0);
}

export function chunkText(content, { maxChunk = 880, minChunk = 120 } = {}) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let buffer = "";

  const flush = () => {
    const t = buffer.trim();
    if (t.length >= minChunk) chunks.push(t);
    buffer = "";
  };

  for (const para of paragraphs) {
    if (para.length > maxChunk) {
      flush();
      for (let i = 0; i < para.length; i += maxChunk) {
        const slice = para.slice(i, i + maxChunk).trim();
        if (slice.length >= minChunk) chunks.push(slice);
      }
      continue;
    }

    if (!buffer) {
      buffer = para;
    } else if (buffer.length + 2 + para.length <= maxChunk) {
      buffer = `${buffer}\n\n${para}`.trim();
    } else {
      flush();
      buffer = para;
    }
  }
  flush();

  if (!chunks.length && content.trim()) {
    const t = content.trim();
    if (t.length > maxChunk) {
      const out = [];
      for (let i = 0; i < t.length; i += maxChunk) {
        out.push(t.slice(i, i + maxChunk));
      }
      return out;
    }
    return [t];
  }

  return chunks;
}
