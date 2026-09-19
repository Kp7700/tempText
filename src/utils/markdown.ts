import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure DOMPurify hook to ensure all external links open safely in a new tab
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

/**
 * Parses markdown text into sanitized, safe HTML.
 */
export function renderMarkdownToHtml(markdownText: string): string {
  if (!markdownText) return '';

  try {
    const rawHtml = marked.parse(markdownText, { async: false }) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'br',
        'hr',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'del',
        'mark',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'a',
        'span',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    });

    return cleanHtml;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    // Safe fallback to escaped text
    return DOMPurify.sanitize(markdownText);
  }
}
