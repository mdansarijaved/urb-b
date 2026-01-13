import type { Product, User } from "../types.js";

export const users = new Map<string, User>();
export const productMap = new Map<string, Product>();
export const cart = new Map<string, Product>();
