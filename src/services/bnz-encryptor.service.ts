import { BnzEncyptResponse } from "../models/BnzEncyptResponse";
import { encryptLoginCredentials } from "./bnzEncrypterRaw";

class BnzEncrypterService {
  Encrypt(
    id: string,
    password: string,
    publicKey: string
  ): Promise<BnzEncyptResponse | void> | null | undefined {
    return encryptLoginCredentials(id, password, publicKey)?.then((x) => {
      return { key: x };
    });
  }
}

export default BnzEncrypterService;
