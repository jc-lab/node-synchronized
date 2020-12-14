import { Synchronized }  from '../src';
import * as uuid from 'uuid';

import { expect } from 'chai';

describe('Basic Test', function () {
  it('test01', (done: () => void) => {
    const block = new Synchronized();

    const synchronizedResult: string[] = [];

    const promises: Promise<void>[] = [];
    for(let i=0; i<5; i++) {
      const uid = uuid.v4().substr(0, 8);
      promises.push(block.synchronized((first) => {
        synchronizedResult.push(uid);
        return new Promise<void>(resolve => {
          setTimeout(() => {
            synchronizedResult.push(uid);
            resolve();
          }, 100);
        });
      }));
    }

    Promise.all(promises)
      .then(() => {
        while(1) {
          const a = synchronizedResult.shift();
          const b = synchronizedResult.shift();
          if (!a && !b) {
            break;
          }
          expect(a).eq(b);
        }

        done();
      });
  });
});
