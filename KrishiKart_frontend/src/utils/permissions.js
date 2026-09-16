// Role-based access matrix for the UI.
//
// Note on backend enforcement: the API itself only restricts one endpoint
// by role today -- DELETE /api/Owners/{id} requires "Admin"
// ([Authorize(Roles = "Admin")] in OwnersController). Every other endpoint
// is just [Authorize] (any logged-in user, any role). The rules below shape
// what each role *sees and can do from the UI*; they mirror sensible
// real-world permissions for the three roles (Admin / Owner / Farmer), but
// if you need this enforced server-side too, the matching [Authorize(Roles
// = "...")] attributes should be added to the other controllers.

export const ROLES = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  FARMER: 'Farmer',
}

export const ALL_ROLES = [ROLES.ADMIN, ROLES.OWNER, ROLES.FARMER]

// view/create/edit/delete -> list of roles allowed to do that action
export const PERMISSIONS = {
  farmers: {
    view: [ROLES.ADMIN, ROLES.OWNER],
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  owners: {
    view: [ROLES.ADMIN, ROLES.OWNER],
    create: [ROLES.ADMIN],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  machinery: {
    view: ALL_ROLES,
    create: [ROLES.ADMIN, ROLES.OWNER],
    edit: [ROLES.ADMIN, ROLES.OWNER],
    delete: [ROLES.ADMIN, ROLES.OWNER],
  },
  bookings: {
    view: ALL_ROLES,
    create: [ROLES.ADMIN, ROLES.FARMER],
    edit: ALL_ROLES,
    delete: [ROLES.ADMIN, ROLES.OWNER],
  },
  payments: {
    view: ALL_ROLES,
    create: [ROLES.ADMIN, ROLES.FARMER],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
  maintenances: {
    view: [ROLES.ADMIN, ROLES.OWNER],
    create: [ROLES.ADMIN, ROLES.OWNER],
    edit: [ROLES.ADMIN, ROLES.OWNER],
    delete: [ROLES.ADMIN, ROLES.OWNER],
  },
  invoices: {
    view: ALL_ROLES,
    create: [ROLES.ADMIN, ROLES.OWNER],
    edit: [ROLES.ADMIN],
    delete: [ROLES.ADMIN],
  },
}

export function can(role, entity, action) {
  return PERMISSIONS[entity]?.[action]?.includes(role) ?? false
}

export function canView(role, entity) {
  return can(role, entity, 'view')
}
