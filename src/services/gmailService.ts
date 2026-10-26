export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  unread: boolean;
  bodyPreview?: string;
}

// Convert string to base64url format for Gmail API
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du profil Gmail (${response.status})`);
  }

  return response.json();
}

export async function listGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 10
): Promise<GmailMessageItem[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.set('q', query);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la liste des e-mails (${response.status})`);
  }

  const data = await response.json();
  const messagesList = data.messages || [];

  // Fetch header details for each message in parallel
  const details = await Promise.all(
    messagesList.slice(0, maxResults).map(async (m: { id: string }) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!msgRes.ok) return null;
        const msgData = await msgRes.json();

        const headers: GmailMessageHeader[] = msgData.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        return {
          id: msgData.id,
          threadId: msgData.threadId,
          snippet: msgData.snippet || '',
          subject: getHeader('Subject') || '(Sans objet)',
          from: getHeader('From'),
          to: getHeader('To'),
          date: getHeader('Date'),
          unread: (msgData.labelIds || []).includes('UNREAD'),
        } as GmailMessageItem;
      } catch (err) {
        console.error('Error fetching message details', err);
        return null;
      }
    })
  );

  return details.filter((item): item is GmailMessageItem => item !== null);
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyText: string;
}

export async function sendGmailEmail(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string }> {
  // Construct RFC 2822 email format
  const emailLines = [
    `To: ${payload.to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    payload.bodyText.replace(/\n/g, '<br/>'),
  ];

  const rawMessage = base64UrlEncode(emailLines.join('\r\n'));

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawMessage }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Échec de l'envoi de l'e-mail via Gmail (${response.status})`
    );
  }

  return response.json();
}
