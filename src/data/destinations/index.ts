import { DestinationInfo, Attraction } from '../../types';
import { vijayawadaData } from './vijayawada';
import { visakhapatnamData } from './visakhapatnam';
import { hyderabadData } from './hyderabad';
import { goaData } from './goa';
import { jaipurData } from './jaipur';
import { bengaluruData } from './bengaluru';
import { chennaiData } from './chennai';
import { delhiData } from './delhi';
import { mumbaiData } from './mumbai';
import { varanasiData } from './varanasi';

export const DESTINATIONS_DATA: Record<string, DestinationInfo> = {
  Vijayawada: vijayawadaData,
  Visakhapatnam: visakhapatnamData,
  Hyderabad: hyderabadData,
  Goa: goaData,
  Jaipur: jaipurData,
  Bengaluru: bengaluruData,
  Chennai: chennaiData,
  Delhi: delhiData,
  Mumbai: mumbaiData,
  Varanasi: varanasiData
};

/**
 * Normalizes a place name to detect duplicate attractions across days
 * even if they have slight naming differences (e.g. "Prakasam Barrage",
 * "Prakasam Barrage, Vijayawada", "Prakasam Barrage - Vijayawada").
 */
export function normalizePlaceName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthesized details
    .replace(/,\s*[a-z\s]+/gi, '') // remove trailing commas and locations
    .replace(/-\s*[a-z\s]+$/gi, '') // remove trailing dashes
    .replace(/^(the|sri|ancient|historic|famous)\s+/gi, '') // remove common prefixes
    .replace(/[^a-z0-9]/g, '') // remove punctuation & whitespace
    .trim();
}

/**
 * Resolves a destination by exact match, case-insensitive match, or partial match.
 */
export function getDestinationData(destinationName: string): DestinationInfo {
  const trimmed = (destinationName || '').trim();
  if (DESTINATIONS_DATA[trimmed]) {
    return DESTINATIONS_DATA[trimmed];
  }
  const lower = trimmed.toLowerCase();
  for (const key of Object.keys(DESTINATIONS_DATA)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return DESTINATIONS_DATA[key];
    }
  }
  // Default to Vijayawada if unknown
  return DESTINATIONS_DATA['Vijayawada'];
}

export {
  vijayawadaData,
  visakhapatnamData,
  hyderabadData,
  goaData,
  jaipurData,
  bengaluruData,
  chennaiData,
  delhiData,
  mumbaiData,
  varanasiData
};
