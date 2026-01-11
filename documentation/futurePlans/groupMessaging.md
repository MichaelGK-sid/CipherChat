## 📌 Group Messaging Plan (Future Work)

### Overview

The system will extend 1-to-1 end-to-end encrypted messaging (based on the **Signal Double Ratchet**) to support **group chats** using a **pairwise fan-out model**, similar to early iMessage group messaging.

Instead of introducing a shared group key, each pair of users in a group maintains an independent secure channel.

---

### Core Idea

- Every pair of users already has a **secure 1-to-1 Double Ratchet session**
- A group is treated as a **set of pairwise secure channels**
- To send a group message:
  - The sender encrypts the same plaintext **separately for each recipient**
  - Each encryption uses the existing pairwise Double Ratchet session

This results in one encrypted message per recipient.

---

### Why This Design

This approach intentionally prioritizes **security, simplicity, and correctness** over scalability.

#### Security Benefits

- **Forward secrecy**  
  Each message uses per-recipient ratcheted keys.

- **Post-compromise security (self-healing)**  
  If a symmetric key for one pair is compromised, the channel automatically recovers after the next DH ratchet step.

- **Strong isolation**  
  Compromise of one pairwise channel does not affect:
  - Other members
  - Other channels
  - Past or future messages outside that pair

- **No shared group secrets**  
  There is no single key whose compromise breaks the entire group.

---

### Group Membership Handling

- **Adding a member**  
  → Establish new pairwise sessions with existing members.

- **Removing a member**  
  → Simply stop encrypting messages for that user.

No group-wide rekeying is required.

---

### Trade-offs

- **Performance cost**  
  Sending one group message requires `O(n)` encryptions and uploads (one per recipient).

- **Scalability limits**  
  Best suited for:
  - Small to medium groups
  - Security-first designs
  - Early or experimental implementations

This trade-off is intentional and may be revisited later.

---

### Future Improvements (Optional)

If scalability becomes a concern, the system may later evolve toward **Sender Keys** (Signal-style) for reduced encryption overhead. This approach trades some security properties for efficiency and increased complexity.

---

### Summary

This design:
- Reuses the existing, well-understood Double Ratchet protocol
- Preserves all 1-to-1 security guarantees in group settings
- Avoids complex group key management
- Provides a strong, easy-to-reason-about foundation for group messaging


### Sources
The great visualization video provided was sourced from the Computerphile youtube channel, specifically this video: https://www.youtube.com/watch?v=Q0_lcKrUdWg. 
