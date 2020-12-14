# node-synchronized

```typescript
import { Synchronized }  from 'node-synchronized';

const block = new Synchronized();

block.synchronized((isFirst) => {
  // When acquiring the first lock, isFirst == true.
});

block.synchronized((first) => {
  // When acquiring the first lock, isFirst == true.
});
```

# example

[example.ts](./test/example.ts)

output:

```text
A: isFirst=true
B: isFirst=false

C: isFirst=true
D: isFirst=false
```

# License

[Apache-2.0 License](LICENSE)
