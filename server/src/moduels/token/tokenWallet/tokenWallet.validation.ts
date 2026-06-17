import z from "zod";
import { WalletStatus } from "./tokenWallet.types.js";

// wallet validation

export const freezeWalletSchema = z.object({
  body: z.object({
    reason: z
      .string({ error: "Freeze reason is required" })
      .trim()
      .trim()
      .min(10, "Reason must be at least 10 characters")
      .max(300, "Reason cannot exceed 300 characters"),
  }),
  params: z.object({
    userId: z.string({ error: "userId param is required" }),
  }),
});

// unfreeze wallet validation

export const unfreezeWalletSchema = z.object({
  params: z.object({
    userId: z.string({ error: "userId param is required" }),
  }),
});

// recalculate blaance 

export const recalculateBalanceSchema = z.object({
  params: z.object({
    userId: z.string({ error: 'userId param is required' }),
  }),
});

// list wallet schema

export const listWalletsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(WalletStatus).optional(),
    page:   z.coerce.number().min(1).default(1),
    limit:  z.coerce.number().min(1).max(100).default(20),
  }),
});

export type FreezeWalletInput       = z.infer<typeof freezeWalletSchema>;
export type UnfreezeWalletInput     = z.infer<typeof unfreezeWalletSchema>;
export type RecalculateBalanceInput = z.infer<typeof recalculateBalanceSchema>;
export type ListWalletsInput        = z.infer<typeof listWalletsSchema>;
 