import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  password: text("password"),
  role: text("role").default("user"), // Tambahan kustom kita
  phone: text("phone"), // Tambahan kustom kita
  isPhoneVerified: boolean("is_phone_verified").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"), // Di sini password tersimpan (hashed)
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// --- TABEL BISNIS KITA (VENDOR & INQUIRY) ---

export const vendorProfile = pgTable("vendor_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  businessName: text("business_name").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  basePrice: numeric("base_price", { precision: 15, scale: 2 }).default("0"),
  description: text("description"),
  location: text("location").default("Buleleng"),
  address: text("address"),
  images: jsonb("images").$type<{ url: string; alt?: string }[]>().default([]),
  isVerified: boolean("is_verified").default(false),
  isRecommended: boolean("is_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").references(() => user.id, { onDelete: "set null" }),
  planName: text("plan_name"),
  ceremonyDate: text("ceremony_date"),
  selectedVendors: jsonb("selected_vendors").default([]),
  totalEstimate: numeric("total_estimate", { precision: 15, scale: 2 }).default(
    "0"
  ),
  platformFee: numeric("platform_fee", { precision: 15, scale: 2 }).default(
    "0"
  ),
  serviceType: text("service_type").default("self_service"),
  status: text("status")
    .$type<
      | "draft"
      | "pending_payment" // Khusus Self Service nunggu 50rb
      | "managed_by_wo" // Masuk antrean WO Bapak
      | "checking_availability"
      | "waiting_confirmation"
      | "negotiating"
      | "completed"
      | "cancelled"
    >()
    .default("draft"),
  paymentStatus: text("payment_status")
    .$type<"unpaid" | "paid">()
    .default("unpaid"), // Tambahkan ini untuk tracking Platform Fee
  createdAt: timestamp("createdAt").defaultNow(),
});
export const vendorPackages = pgTable("vendor_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id")
    .references(() => vendorProfile.id, { onDelete: "cascade" })
    .notNull(),

  // Tier: 'alit', 'madya', 'utama'
  tier: text("tier").notNull(),
  packageName: text("package_name").notNull(), // Contoh: "Paket Alit Mawar"
  price: numeric("price", { precision: 15, scale: 2 }).notNull().default("0"),

  // List keunggulan paket (Array of strings)
  features: jsonb("features").$type<string[]>().default([]),

  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const planItems = pgTable("plan_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  planId: uuid("plan_id")
    .references(() => inquiries.id, { onDelete: "cascade" })
    .notNull(),
  vendorId: uuid("vendor_id")
    .references(() => vendorProfile.id)
    .notNull(),
  packageId: uuid("package_id").references(() => vendorPackages.id),
  category: text("category").notNull(), // MUA, Photographer, Venue, dll
  priceAtTime: numeric("price_at_time", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

//Relations

export const userRelations = relations(user, ({ many }) => ({
  vendorProfiles: many(vendorProfile),
}));

// Definisikan Relasi untuk Vendor Profile
export const vendorProfileRelations = relations(
  vendorProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [vendorProfile.userId],
      references: [user.id],
    }),
    packages: many(vendorPackages),
  })
);

export const inquiriesRelations = relations(inquiries, ({ one, many }) => ({
  user: one(user, {
    fields: [inquiries.userId],
    references: [user.id],
  }),
  planItems: many(planItems), // Satu rencana punya banyak item vendor
}));

// 2. Hubungan untuk PlanItems (Detail Vendor)
export const planItemsRelations = relations(planItems, ({ one }) => ({
  inquiry: one(inquiries, {
    fields: [planItems.planId],
    references: [inquiries.id],
  }),
  vendor: one(vendorProfile, {
    fields: [planItems.vendorId],
    references: [vendorProfile.id],
  }),
  package: one(vendorPackages, {
    fields: [planItems.packageId],
    references: [vendorPackages.id],
  }),
}));

// Tambahkan Relasi baru untuk vendorPackages
export const vendorPackagesRelations = relations(vendorPackages, ({ one }) => ({
  vendor: one(vendorProfile, {
    fields: [vendorPackages.vendorId],
    references: [vendorProfile.id],
  }),
}));
