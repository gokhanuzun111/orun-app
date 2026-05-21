import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import authRouter from "./auth";
import membershipRouter from "./membership";
import clubsRouter from "./clubs";
import eventsRouter from "./events";
import moderationRouter from "./moderation";
import consentRouter from "./consent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(authRouter);
router.use(membershipRouter);
router.use(clubsRouter);
router.use(eventsRouter);
router.use(moderationRouter);
router.use(consentRouter);

export default router;
