/**
 * React Hook for SBC Solver
 */

import { useState, useCallback } from 'react';
import { SBCRequirement, SolverOptions, SolverResult } from '../types/sbc';
import { solveSBC } from '../services/sbcSolver';

interface UseSBCSolverReturn {
  isLoading: boolean;
  result: SolverResult | null;
  error: Error | null;
  solve: (requirement: SBCRequirement, options: SolverOptions) => Promise<void>;
  clearResult: () => void;
}

export function useSBCSolver(): UseSBCSolverReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const solve = useCallback(async (requirement: SBCRequirement, options: SolverOptions) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const solution = await solveSBC(requirement, options);
      setResult(solution);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    result,
    error,
    solve,
    clearResult,
  };
}


