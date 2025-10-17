import crypto from "crypto";
import { v3 as uuidv3 } from "uuid";

export function deterministicIdFromDoc(doc: {
  vector: number[];
  metadata?: Record<string, number | boolean | string>;
}) {
  const serialized = JSON.stringify({
    vector: doc.vector,
    metadata: doc.metadata ?? {},
  });
  const hash = crypto.createHash("sha256").update(serialized).digest("hex");
  const uuid_id = uuidv3(hash, uuidv3.DNS);
  return uuid_id;
}

// const id = deterministicIdFromDoc({
//   vector: [1, 2, 3],
//   metadata: { key: "value" },
// });
// console.log(id);
