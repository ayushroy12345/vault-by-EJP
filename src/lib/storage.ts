import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const VAULT_BUCKET = "founder-vault";
export const VAULT_SIGNED_URL_TTL_SECONDS = 300;

export type VaultItem = {
  name: string;
  path: string;
  isFolder: boolean;
};

export type VaultCategory = {
  title: string;
  description: string;
  /** Explicit file paths (at the bucket root) shown directly in this category. */
  files?: string[];
  /** Folder prefixes whose contents are listed for this category. */
  roots?: string[];
};

/**
 * Founder Vault v1.0 is stored in the private `founder-vault` bucket as loose
 * files and folders (no large ZIPs). Each category maps to the exact folders /
 * root files that were uploaded. Paths here must match the bucket exactly.
 */
export const VAULT_CATEGORIES = {
  "01-investor-vc-resources": {
    title: "Investor & VC Resources",
    description: "Verified investor and VC lists to target for your raise.",
    files: [
      "250+ VC Firms & Angel Investors Data that accept cold outreach from founders_Nistharsha_IIML.xlsx",
      "Angel Investors and VC Funds.xlsx",
      "Family office avalance US(1).xlsx",
      "Family office avalance US.xlsx",
      "Full_Indian_Angel_Investors_List.docx",
      "Indian VCs Database (1).pdf",
      "Indian VCs Database.pdf",
      "Investor data.xlsx",
      "Investors List.xlsx",
      "Investors List_Suyesh Gupta.xlsx",
      "UAE Investors.pdf",
      "VC Listing - Hari Rastogi_BIMTECH (1).xlsx",
      "Verified Data of 1000+ Investors (New).xlsx",
    ],
  },
  "02-pitch-deck-resources": {
    title: "Pitch Deck Resources",
    description: "Investor-ready pitch decks and templates.",
    files: ["Funded Startups Pitch decks Google drive link.rtf"],
    roots: ["Pitch Deck Templates"],
  },
  "03-business-planning": {
    title: "Business Planning",
    description: "Step-by-step plans and frameworks to structure your venture.",
    roots: ["Business Plan Templates"],
  },
  "04-financial-resources": {
    title: "Financial Resources",
    description: "Financial projections and models to back your funding.",
    roots: ["Financial Projections", "Startup Seed Funding Template"],
  },
  "05-legal-resources": {
    title: "Legal Resources",
    description: "Legal templates and documents to protect your startup.",
    roots: ["Agreements templates"],
  },
  "06-business-resources": {
    title: "Business Docs Pro",
    description: "1,000+ business document templates for every scenario.",
    roots: ["Business Docs Pro Collection (1000+ templates)"],
  },
  "07-founder-resources": {
    title: "Founder Resources",
    description: "Essential guides and resources for your founder journey.",
    roots: ["Startup Resources"],
  },
} satisfies Record<string, VaultCategory>;

export type VaultCategoryId = keyof typeof VAULT_CATEGORIES;

const categoryConfigs = VAULT_CATEGORIES as Record<string, VaultCategory>;

function allowedExplicitFiles(): string[] {
  return Object.values(categoryConfigs).flatMap((c) => c.files ?? []);
}

function allowedRoots(): string[] {
  return Object.values(categoryConfigs).flatMap((c) => c.roots ?? []);
}

/**
 * Restricts downloads/browse to paths that belong to the product: either an
 * explicit root file or anything under one of the configured category folders.
 */
export function isVaultPathAllowed(path: string): boolean {
  if (!path || path.startsWith("/") || path.split("/").includes("..")) {
    return false;
  }
  if (allowedExplicitFiles().includes(path)) {
    return true;
  }
  return allowedRoots().some(
    (root) => root !== "" && (path === root || path.startsWith(`${root}/`))
  );
}

async function listFolder(prefix: string): Promise<VaultItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(VAULT_BUCKET).list(prefix, {
    limit: 500,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) {
    throw new Error(`Supabase storage list failed: ${error.message}`);
  }
  return (data ?? []).map((entry) => ({
    name: entry.name,
    path: prefix ? `${prefix}/${entry.name}` : entry.name,
    isFolder: entry.id === null,
  }));
}

/** Files + immediate folder contents for a category, folders first. */
export async function listVaultCategoryItems(
  categoryId: VaultCategoryId
): Promise<VaultItem[]> {
  const config = categoryConfigs[categoryId];
  const items: VaultItem[] = (config.files ?? []).map((file) => ({
    name: file.split("/").pop() ?? file,
    path: file,
    isFolder: false,
  }));

  for (const root of config.roots ?? []) {
    items.push(...(await listFolder(root)));
  }

  return items.sort((a, b) =>
    a.isFolder === b.isFolder ? a.name.localeCompare(b.name) : a.isFolder ? -1 : 1
  );
}

/** Direct children of a folder, used by the /vault/browse drill-down. */
export async function listVaultFolderItems(path: string): Promise<VaultItem[]> {
  return listFolder(path);
}

/**
 * Short-lived signed URL for one file in the private `founder-vault` bucket.
 * Server-only. Returns null (fail closed) if the file is missing or the admin
 * client is unavailable — the caller then errors instead of leaking a link.
 */
export async function getVaultSignedUrl(path: string): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(VAULT_BUCKET)
      .createSignedUrl(path, VAULT_SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      console.error("Vault signed URL generation failed", {
        path,
        message: error?.message ?? "no signed URL returned",
      });
      return null;
    }
    return data.signedUrl;
  } catch (error) {
    console.error("Vault signed URL generation failed", {
      path,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return null;
  }
}
