export class Subproblem {

    public index: number; // This flag specifies if the test cases will be added to description or not
    public source_code: string; // Input to test in the evaluator
    public ready: boolean; // The output generated for this problem
  
    constructor(it: number, code: string, accepted: boolean) {
      this.index = it;
      this.source_code = code;
      this.ready = accepted;
    }
  
  }