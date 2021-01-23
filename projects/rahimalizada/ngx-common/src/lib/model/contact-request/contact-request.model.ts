import { ObjectId } from '../mongodb/object-id.model';
import { WithID } from '../with-id.model';

export interface ContactRequest extends WithID<ObjectId> {
  id: ObjectId;
  userId?: string;
  name: string;
  email: string;
  message: string;
  created: Date;
}
