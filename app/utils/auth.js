export async function isAdminReq() {
  const session = await getServerSession(authOptions);
  if (!adminEmail.includes(session?.user?.email)) {
    return NextResponse.json(
      { error: "You are not authorized to access this resource." },
      { status: 403 }
    );
  }
  return session;
}
