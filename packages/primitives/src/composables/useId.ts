import { ref } from 'vue';

let idSequence = 0;

export function useId(prefix = 'ui') {
  idSequence += 1;
  return ref(`${prefix}-${idSequence}`);
}
