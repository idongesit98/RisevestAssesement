import { User as AuthenticatedUser} from "@prisma/client";

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
    interface Request {
      user?: User;
    }
  }
}