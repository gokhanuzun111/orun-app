import { apiFetch } from "./api";

export async function submitReport(data: {
  reportedUserId?: number;
  reportedHandle?: string;
  roomId?: string;
  clubId?: string;
  reason: string;
  details?: string;
}): Promise<void> {
  await apiFetch("/reports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function recordConsent(consentType: "kvkk" | "tos" | "gizlilik", version: string): Promise<void> {
  await apiFetch("/consent", {
    method: "POST",
    body: JSON.stringify({ consentType, version }),
  });
}
