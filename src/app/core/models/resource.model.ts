/**
 * Attribute object model
 */
export class DSAttribute {
  /** System name */
  SystemName: string;
  /** Display name */
  DisplayName?: string;
  /** Description */
  Description?: string;
  /** Attribute type */
  Type?: string;
  /** Regular expression for validation */
  RegEx?: string;
  /** Permission infomation */
  PermissionHint?: string;
  /** Attribute single-value */
  Value?: any;
  /** Attribute multi-value */
  Values?: Array<any>;
  /** Resolved single-value if the attribute is a single-value reference */
  ResolvedValue?: DSResource;
  /** Resolved multi-value if the attribute is a multi-value reference */
  ResolvedValues?: Array<DSResource>;
  /** Indicate whether the attribte value is multi-value */
  IsMultivalued?: boolean;
  /** Indicate whether the attribute can noly be read */
  IsReadOnly?: boolean;
  /** Indicate whether the attribute is mandatory */
  IsRequired?: boolean;
  /** Indicate whether the attribute value has been modified */
  IsDirty?: boolean;
  /** Indicate whether the attribute value is present */
  IsNull?: boolean;
}

/**
 * Resource object model
 */
export class DSResource {
  /** Object ID (GUID) */
  ObjectID: string;
  /** Object Type */
  ObjectType?: string;
  /** Display name */
  DisplayName?: string;
  /** Indicate whether attribute permissions are included */
  HasPermissionHints?: boolean;
  /** A dictionary of Attribute definition and values */
  Attributes?: { [key: string]: DSAttribute };
}

/**
 * Resource set object model
 */
export class DSResourceSet {
  /** Total count */
  TotalCount: number;
  /** Indicate whether all resources have been fetched */
  HasMoreItems: boolean;
  /** An array of resources */
  Resources: Array<DSResource>;
}
