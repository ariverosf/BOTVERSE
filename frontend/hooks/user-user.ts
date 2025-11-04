import { cookies } from 'next/headers';

export default async function useUser() {
  const token = (await cookies()).get("access_token")!.value;
  const encodedPayload = token.split(".")[1];
  const decodedPayload = atob(encodedPayload);

  const user = JSON.parse(decodedPayload)!.user;
  const userFullNameSplitted = user.fullName.split(" ")
  const userInitials = userFullNameSplitted[0][0] + userFullNameSplitted[userFullNameSplitted.length - 1][0]

  return { user, userInitials };
}