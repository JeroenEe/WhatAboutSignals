type ResultUnit = 'milliseconds' | 'seconds';

interface IPerformanceOptions {
  resultUnit: ResultUnit;
  resultColor: string;
  requiredNoOfExecutions: number;
  enableTrace: boolean
}

/**
 * @param options Supplies configuration metadata to control how the performance is evaluated
 * @param options.resultUnit To view the result in milliseconds (or) seconds
 * @param options.resultColor Result color to be viewed in browser console
 * @param options.requiredNoOfExecutions Controls the number of executions of your actual method
 * @param options.enableTrace  To view internal trace
 */
export function EvaluatePerformance(options?: Partial<IPerformanceOptions>) {
  return (
    target: Object,
    property: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const resultColor = options?.resultColor || 'yellow';
    const noOfExecutions = options?.requiredNoOfExecutions || 1;
    const style = `background: black; color: ${resultColor};font-size: 14px`;
    const isTraceEnabled = options?.enableTrace;
    const actualMethod: Function = propertyDescriptor.value;
    const metrics: any[] = [];
    
    // Create a modified method that preserves the 'this' context
    propertyDescriptor.value = function(this: any, ...args: any[]) {
      for(let i = 1; i <= noOfExecutions; i++) {
        const tStart = performance.now();
        actualMethod.apply(this, args);
        const tEnd = performance.now();
        const ms = tEnd - tStart;
        metrics.push(ms);
      }

      const total = metrics.reduce((sum, m) => {
        sum = sum + m;
        return sum;
      }, 0);

      const meanPerformanceInMs = total / metrics.length;

      if(isTraceEnabled) {
        console.log('Total metrics', metrics.length);
      }
      
      console.log(`%c Performance for ${property}: ${meanPerformanceInMs.toFixed(4)}ms`, style);
      
      // Return the result of the original method
      return actualMethod.apply(this, args);
    };
    
    return propertyDescriptor;
  };
}
