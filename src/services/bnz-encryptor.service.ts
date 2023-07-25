import { encryptLoginCredentials } from "./bnzEncrypterRaw";

class BnzEncrypterService {
  Encrypt(id: string, password: string, publicKey: string): string {
    return encryptLoginCredentials(id, password, publicKey);
  }
}

export default BnzEncrypterService;
