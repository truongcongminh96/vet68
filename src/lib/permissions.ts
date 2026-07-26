export type StaffRole = "staff" | "admin";

export function canManageCatalogue(role: StaffRole) {
  return role === "staff" || role === "admin";
}

export function canDeleteCatalogue(role: StaffRole) {
  return role === "admin";
}

export function canManageSiteSettings(role: StaffRole) {
  return role === "admin";
}
