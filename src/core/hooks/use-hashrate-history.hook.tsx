import React from 'react';
import { useSimpleMovingAverage } from './use-moving-average.hook';

export const useHashrateHistory = (initial:number[]) => {
  const [history, setHistory] = React.useState<number[]>(initial);
  const add = React.useCallback((value:number) => setHistory((h) => [...h, value].slice(-60)), []);
  const reset = () => setHistory(initial);
  const sma = useSimpleMovingAverage(history, 6);
  return {
    history,
    add,
    reset,
    sma,
  };
};
