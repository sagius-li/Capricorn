/**
 * Interface for component, which can be created dynamically
 */
export interface DcComponent {
  /** Data to be passed in */
  data: any;
  /** Initialize component */
  initComponent: () => any;
  /** Update data source */
  updateDataSource: () => void;
  /** resize component */
  resize: (size: number[]) => void;
  /** configure component */
  configure: () => any;
}
