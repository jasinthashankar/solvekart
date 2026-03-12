export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home", "/cart", "/checkout", "/profile", "/admin/:path*"],
};
