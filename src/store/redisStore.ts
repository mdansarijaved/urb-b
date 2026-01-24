import { redisClient } from "../config/redis.js";
import type { Product, shortURL } from "../types.js";

const URL_KEY = "shorturl";
const USER_RECONCILIATION_KEY = "user:reconciliation";
const IDENTIFIER_KEY = "identifier";
const USER_CACHE_TTL = 3600;

const parseURL = (value: string | null): shortURL | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as shortURL;
  } catch {
    return null;
  }
};

const parseJSON = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const saveUrl = async (url: shortURL) => {
  await redisClient.hSet(URL_KEY, url.id, JSON.stringify(url));
};

export const getUrl = async (id: string) => {
  const url = await redisClient.hGet(URL_KEY, id);
  return parseURL(url);
};

export const getIdentifierReconciliationId = async (identifier: string, value: string): Promise<string | null> => {
  const key = `${IDENTIFIER_KEY}:${identifier}:${value}`;
  return await redisClient.get(key);
};

export const setIdentifierReconciliationId = async (identifier: string, value: string, reconciliationId: string): Promise<void> => {
  const key = `${IDENTIFIER_KEY}:${identifier}:${value}`;
  await redisClient.set(key, reconciliationId, { EX: USER_CACHE_TTL });
};

export const getMultipleIdentifierReconciliationIds = async (
  identifiers: { identifier: string; value: string }[]
): Promise<Map<string, string>> => {
  const result = new Map<string, string>();
  if (identifiers.length === 0) return result;

  const keys = identifiers.map((i) => `${IDENTIFIER_KEY}:${i.identifier}:${i.value}`);
  const values = await redisClient.mGet(keys);

  identifiers.forEach((id, index) => {
    const val = values[index];
    if (val) {
      result.set(`${id.identifier}:${id.value}`, val);
    }
  });

  return result;
};

export const setMultipleIdentifierReconciliationIds = async (
  identifiers: { identifier: string; value: string }[],
  reconciliationId: string
): Promise<void> => {
  if (identifiers.length === 0) return;

  const pipeline = redisClient.multi();
  for (const id of identifiers) {
    const key = `${IDENTIFIER_KEY}:${id.identifier}:${id.value}`;
    pipeline.set(key, reconciliationId, { EX: USER_CACHE_TTL });
  }
  await pipeline.exec();
};

export const getUserReconciliation = async <T>(id: string): Promise<T | null> => {
  const key = `${USER_RECONCILIATION_KEY}:${id}`;
  const data = await redisClient.get(key);
  return parseJSON<T>(data);
};

export const setUserReconciliation = async <T>(id: string, user: T): Promise<void> => {
  const key = `${USER_RECONCILIATION_KEY}:${id}`;
  await redisClient.set(key, JSON.stringify(user), { EX: USER_CACHE_TTL });
};

export const deleteUserReconciliation = async (id: string): Promise<void> => {
  const key = `${USER_RECONCILIATION_KEY}:${id}`;
  await redisClient.del(key);
};

export const deleteMultipleUserReconciliations = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  const keys = ids.map((id) => `${USER_RECONCILIATION_KEY}:${id}`);
  await redisClient.del(keys);
};

