import { DSAttribute } from './resource.model';

/** Attribute Configuartion Model */
export class DSAttributeConfig {
  attribute: DSAttribute;
  displayName: string;
  description: string;
  editMode = false;
  configMode = false;
  readonly = false;
}
