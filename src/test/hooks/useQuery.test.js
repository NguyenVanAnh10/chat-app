import { renderHook } from '@testing-library/react-hooks';

import useQuery from 'hooks/useQuery';

it('get params object from params string', () => {
  const { result } = renderHook(() => useQuery('?a=query1&b=query2'));
  expect(result.current).toEqual({ a: 'query1', b: 'query2' });
});

it('get params object from params number', () => {
  const { result } = renderHook(() => useQuery('?a=1&b=2'));
  expect(result.current).toEqual({ a: 1, b: 2 });
});

it('get params object from params undefined | null | NaN', () => {
  const { result } = renderHook(() => useQuery('?a=1&b=undefined&c=null&d=NaN'));
  expect(result.current).toEqual({ a: 1 });
});
