import { Synchronized }  from '../src';

const block = new Synchronized();

block.synchronized((isFirst) => {
  console.log(`A: isFirst=${isFirst}`);
  return new Promise<void>(resolve => setTimeout(resolve, 100));
});

block.synchronized((isFirst) => {
  console.log(`B: isFirst=${isFirst}`);
  return new Promise<void>(resolve => setTimeout(resolve, 100));
});

setTimeout(() => {
  block.synchronized((isFirst) => {
    console.log(`C: isFirst=${isFirst}`);
    return new Promise<void>(resolve => setTimeout(resolve, 100));
  });

  block.synchronized((isFirst) => {
    console.log(`D: isFirst=${isFirst}`);
    return new Promise<void>(resolve => setTimeout(resolve, 100));
  });
}, 500);
