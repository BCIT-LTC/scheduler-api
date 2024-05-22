const bearer_tokens = {
  admin_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYmNpdC5jYSIsImZpcnN0X25hbWUiOiJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIjoibGFzdF9uYW1lIiwic2FtbF9yb2xlIjoiYWRtaW4iLCJhcHBfcm9sZXMiOlsiYWRtaW4iXSwiZGVwYXJ0bWVudCI6IlNjaG9vbCBvZiBIZWFsdGggU2NpZW5jZXMiLCJhdXRob3JpemF0aW9uX2NoZWNrZWQiOnRydWUsImlzX2xvZ2dlZF9pbiI6dHJ1ZX0.sgEExC0CmkuBuqWqsWT4zIwW1rVjhaoWTl8ej-nt590",
  faculty_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYmNpdC5jYSIsImZpcnN0X25hbWUiOiJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIjoibGFzdF9uYW1lIiwic2FtbF9yb2xlIjoiZmFjdWx0eSIsImFwcF9yb2xlcyI6WyJmYWN1bHR5Il0sImRlcGFydG1lbnQiOiJTY2hvb2wgb2YgSGVhbHRoIFNjaWVuY2VzIiwiYXV0aG9yaXphdGlvbl9jaGVja2VkIjp0cnVlLCJpc19sb2dnZWRfaW4iOnRydWV9.NHYqpmiI0BD4LDpD3vem4Z9P90rtnmJd0an1M1T-p_M",
  student_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYmNpdC5jYSIsImZpcnN0X25hbWUiOiJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIjoibGFzdF9uYW1lIiwic2FtbF9yb2xlIjoic3R1ZGVudCIsImFwcF9yb2xlcyI6WyJzdHVkZW50Il0sImRlcGFydG1lbnQiOiJTY2hvb2wgb2YgSGVhbHRoIFNjaWVuY2VzIiwiYXV0aG9yaXphdGlvbl9jaGVja2VkIjp0cnVlLCJpc19sb2dnZWRfaW4iOnRydWV9.jIHp6A48terKIvoijsuGwtbKWC_5EgDU36YPKfq3E2s",
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

module.exports = { ...tokens, setToken };