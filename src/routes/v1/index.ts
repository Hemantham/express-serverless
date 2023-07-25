import { Router } from "express";

import processes_route from "./processes.route";

const router = Router();

router.use("/processes", processes_route);

export default router;
