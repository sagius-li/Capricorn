import { DSAttribute } from './resource.model';

/** Attribute Configuartion Model */
export class DSAttributeConfig {
  instanceName: string;
  attribute: DSAttribute;
  displayName: string;
  description: string;
  value: string;
  showSystemName = true;
  editMode = true;
  readonly = false;
}
