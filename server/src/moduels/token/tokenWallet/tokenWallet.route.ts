import { Router } from 'express';
import {
  getUserWalletBalance,
  getWalletByUserId,
  listOfAllWallets,
  freezeWallet,
  unfreezeWallet,
  recalculateBalance,
} from './tokenWallet.controller.js';
import {
  freezeWalletSchema,
  unfreezeWalletSchema,
  recalculateBalanceSchema,
  listWalletsSchema,
} from './tokenWallet.validation.js';
import { authMiddleware, isAdmin } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/zod.middleware.js';

const userWalletRouter  = Router();
const adminWalletRouter = Router();

// ── User routes ───────────────────────────────────────────────────────────────

userWalletRouter.use(authMiddleware);
userWalletRouter.get('/me', getUserWalletBalance);

// ── Admin routes ──────────────────────────────────────────────────────────────

adminWalletRouter.use(authMiddleware, isAdmin);

adminWalletRouter.get('/', validate(listWalletsSchema), listOfAllWallets);
adminWalletRouter.get('/:userId', getWalletByUserId);
adminWalletRouter.patch(
  '/:userId/freeze',
  validate(freezeWalletSchema),
  freezeWallet,
);
adminWalletRouter.patch(
  '/:userId/unfreeze',
  validate(unfreezeWalletSchema),
  unfreezeWallet,
);
adminWalletRouter.post(
  '/:userId/recalculate',
  validate(recalculateBalanceSchema),
  recalculateBalance,
);

export { userWalletRouter, adminWalletRouter };