import { Request, Response, Router } from "express";
import BnzEncrypterService from "../../services";

const router = Router();

router.get("/bnz/encrypt", async (req: Request, res: Response) => {
  try {
    var service = new BnzEncrypterService();

    service
      .Encrypt(
        "159527402",
        "Er6EfYtz",
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0r0FPobwSdw70swqLIXj9KUWaqeydWXHSjRirqM+aeSjihyk398rwbrVQFhOoaPKWy7bToPuBcM8lSSyiF5VVdfDhN+WPodnV4ytDIxn6z1SRKmNVfDITRSfdgbS2++TV0jNmtote9WEwnlFGtP67E9YRDCBb5780Rkux7QDcSYlhs4S6NIaJvyXV8MHfMSWrkPA3qS8V/JHfytan8UKCP7yOTYYF42rW4eT/7UutiKqnvOohlcUOEz4SRM1sbmivg6Xq5JhHc+ooTImdV7IzE5ksr5ZgJNalZKRU3Ffoii6ns56ofmBwQ3r6AOMNdx04vAfNH0GrWAAIwAA/5XdjQIDAQAB"
      )
      ?.then((data) => res.status(200).end(data))
      ?.catch((error) => console.error("An error ocurred:", error));
  } catch (error) {
    console.error("An error ocurred:", error);
    res.status(500).json(error);
  }
});

// router.get("/bnz/:id", async (req: Request, res: Response) => {
//   try {
//     res.status(200).json({});
//   } catch (error) {
//     console.error("An error ocurred:", error);
//     res.status(500).json(error);
//   }
// });

router.post("/bnz/", async (req: Request, res: Response) => {
  try {
    res.status(201).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

router.put("/bnz/:id", async (req: Request, res: Response) => {
  try {
    res.status(200).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

router.delete("/bnz/:id", async (req: Request, res: Response) => {
  try {
    res.status(200).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

export default router;
