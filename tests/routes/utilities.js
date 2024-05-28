const bearer_tokens = {
  admin_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJjaXQuY2EiLCJmaXJzdF9uYW1lIjoiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSI6Imxhc3RfbmFtZSIsInNhbWxfcm9sZSI6ImFkbWluIiwiYXBwX3JvbGVzIjpbImFkbWluIl0sImRlcGFydG1lbnQiOiJTY2hvb2wgb2YgSGVhbHRoIFNjaWVuY2VzIiwiYXV0aG9yaXphdGlvbl9jaGVja2VkIjp0cnVlLCJpc19sb2dnZWRfaW4iOnRydWV9.l7EX2w5Ysf3yOnrJKw2sO14LvAhCiT9ZDOTswKlPbMs",
  faculty_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJjaXQuY2EiLCJmaXJzdF9uYW1lIjoiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSI6Imxhc3RfbmFtZSIsInNhbWxfcm9sZSI6ImZhY3VsdHkiLCJhcHBfcm9sZXMiOlsiZmFjdWx0eSJdLCJkZXBhcnRtZW50IjoiU2Nob29sIG9mIEhlYWx0aCBTY2llbmNlcyIsImF1dGhvcml6YXRpb25fY2hlY2tlZCI6dHJ1ZSwiaXNfbG9nZ2VkX2luIjp0cnVlfQ.hQK1xfT0aE0UfJPd0OH2CzQNezQET4aHBnH9Wtgg7ms",
  student_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJjaXQuY2EiLCJmaXJzdF9uYW1lIjoiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSI6Imxhc3RfbmFtZSIsInNhbWxfcm9sZSI6InN0dWRlbnQiLCJhcHBfcm9sZXMiOlsic3R1ZGVudCJdLCJkZXBhcnRtZW50IjoiU2Nob29sIG9mIEhlYWx0aCBTY2llbmNlcyIsImF1dGhvcml6YXRpb25fY2hlY2tlZCI6dHJ1ZSwiaXNfbG9nZ2VkX2luIjp0cnVlfQ.hT3J9zpkEqHjFk81b_qkcQMUpnB8dmfBF7LKvm7-uCY",
  guest_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6bnVsbCwiZmlyc3RfbmFtZSI6bnVsbCwibGFzdF9uYW1lIjpudWxsLCJzYW1sX3JvbGUiOm51bGwsImFwcF9yb2xlcyI6bnVsbCwiZGVwYXJ0bWVudCI6IlNjaG9vbCBvZiBIZWFsdGggU2NpZW5jZXMiLCJhdXRob3JpemF0aW9uX2NoZWNrZWQiOmZhbHNlLCJpc19sb2dnZWRfaW4iOmZhbHNlfQ.qNTYEQ7eRdA6DqyuIwSWS3bcupMQ6P96h6A-t1FaIjE",
};

const tokens = {
  admin: `Bearer ${bearer_tokens.admin_token}`,
  faculty: `Bearer ${bearer_tokens.faculty_token}`,
  student: `Bearer ${bearer_tokens.student_token}`,
  guest: `Bearer ${bearer_tokens.guest_token}`,
  token: `Bearer ${bearer_tokens.guest_token}`,
};

// Automatically sets the request Authorization header to the token
const setToken = (request, token) => {
  // If 'Bearer' is not included in the token, add it
  if (!token.toString().startsWith("Bearer")) {
    token = `Bearer ${token}`;
  }
  return request.set({ Authorization: token });
}

module.exports = { ...tokens, ...bearer_tokens, setToken };