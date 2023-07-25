import { encryptLoginCredentials } from "./bnzEncrypterRaw";

class BnzEncrypterService {
  Encrypt(
    id: string,
    password: string,
    publicKey: string
  ): Promise<string> | null {
    return encryptLoginCredentials(id, password, publicKey);
  }
}

export default BnzEncrypterService;
