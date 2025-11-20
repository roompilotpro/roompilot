package com.roompilot.model;

/**
 * User role enumeration for role-based access control.
 *
 * - HOST: Property managers who list and manage properties
 * - RESIDENT: Tenants who rent rooms
 * - ADMIN: Platform administrators with full access
 */
public enum UserRole {
    HOST,
    RESIDENT,
    ADMIN
}
