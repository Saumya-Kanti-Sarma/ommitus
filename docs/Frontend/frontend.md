at /auth/get-started we handle sign-up/sign-in logic

when user creates account:
 1. we save users data in cookie and navigate then for authentication at /auth/otp where their email is verified.
 2. while saving the data at cookie by default browser automatically changes the spaces to %. this can be easily repaced but the issue is password filed might have % charecter by default. so we repalce spaces with __#$#@!%__ manually and then repace it back to normal after otp is verified. this is done by a utility class present at `/utils/specialChars.ts`

 