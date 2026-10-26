import { Profile, ContactRequest } from '../types';
import { INITIAL_PROFILES, INITIAL_REQUESTS } from '../data/seedProfiles';

const PROFILES_KEY = 'chemin_nikah_profiles_v1';
const REQUESTS_KEY = 'chemin_nikah_requests_v1';
const ADMIN_AUTH_KEY = 'chemin_nikah_admin_session';

export function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profiles from storage', e);
    return INITIAL_PROFILES;
  }
}

export function saveStoredProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles to storage', e);
  }
}

export function getStoredRequests(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load requests from storage', e);
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: ContactRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests to storage', e);
  }
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}
