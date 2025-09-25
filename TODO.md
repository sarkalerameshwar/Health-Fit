# Update Order Placing Files for New User Data Format

## Tasks
- [x] Update user data mapping in frontend/lib/checkout.ts for createOrder function to support new localStorage keys (userId, useremail, username)
- [x] Update user data mapping in frontend/lib/checkout.ts for uploadPaymentProof function to ensure consistency
- [x] Add logging for user data mapping to aid debugging
- [x] Test the changes by placing an order and verifying the payload in console/network

## Notes
- Changes are isolated to frontend/lib/checkout.ts
- Maintain backward compatibility with fallbacks to old keys
- No backend changes needed as frontend sends standard fields
- Restart dev server after changes if running
