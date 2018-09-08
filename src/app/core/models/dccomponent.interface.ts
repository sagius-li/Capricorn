/**
 * Interface for component, which can be created dynamically
 */
export interface DcComponent {
  /** Data to be passed in */
  data: any;
  /** resize event */
  resize: (size: number[]) => void;
}
