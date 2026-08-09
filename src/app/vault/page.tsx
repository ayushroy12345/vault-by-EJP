import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Folder,
  Presentation,
  Rocket,
  Scale,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { verifyVaultToken } from "@/lib/vault-access";
import {
  VAULT_CATEGORIES,
  listVaultCategoryItems,
  type VaultCategoryId,
  type VaultItem,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Vault",
  robots: { index: false, follow: false },
};

const CATEGORY_ICONS: Record<VaultCategoryId, LucideIcon> = {
  "01-investor-vc-resources": Users,
  "02-pitch-deck-resources": Presentation,
  "03-business-planning": ClipboardList,
  "04-financial-resources": Wallet,
  "05-legal-resources": Scale,
  "06-business-resources": FileText,
  "07-founder-resources": Rocket,
};

type CategoryView = {
  id: VaultCategoryId;
  title: string;
  description: string;
  items: VaultItem[];
  failed: boolean;
};

export default async function VaultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const purchase = await verifyVaultToken(token);
  const firstName = (purchase?.customer_name ?? "there").split(" ")[0];

  const categories: CategoryView[] = await Promise.all(
    (Object.keys(VAULT_CATEGORIES) as VaultCategoryId[]).map(async (id) => {
      let items: VaultItem[] = [];
      let failed = false;
      try {
        items = await listVaultCategoryItems(id);
      } catch (error) {
        failed = true;
        console.error("Vault category listing failed:", { category: id, error });
      }
      return { id, ...VAULT_CATEGORIES[id], items, failed };
    })
  );

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-canvas shadow-float">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.09] to-transparent"
          />
          <div className="relative flex flex-col items-center p-8 text-center sm:p-10">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium tracking-wide text-canvas/80 transition-colors hover:border-white/30"
            >
              <Image
                src="/brand/vault-logo.png"
                alt=""
                width={1024}
                height={1024}
                className="size-5 object-contain"
              />
              Founder Vault
            </Link>

            {purchase ? (
              <>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-canvas">
                    <Image
                      src="/brand/vault-logo.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="size-6 object-contain"
                    />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Welcome to Founder Vault, {firstName}
                    </p>
                    <p className="mt-1.5 text-sm text-canvas/60">
                      Your access is unlocked. Everything inside is yours to keep —
                      investor data, pitch decks, planning templates, financial
                      projections, legal documents and founder resources.
                    </p>
                  </div>
                </div>

                <div className="mt-8 w-full text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest text-canvas/50">
                    Your resources
                  </p>
                  <div className="mt-3 flex flex-col gap-4">
                    {categories.map((category) => {
                      const Icon = CATEGORY_ICONS[category.id];
                      return (
                        <section
                          key={category.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-canvas">
                              <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-sm font-semibold tracking-tight">
                                {category.title}
                              </h2>
                              <p className="mt-0.5 text-xs text-canvas/60">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-col gap-1.5">
                            {category.failed ? (
                              <p className="px-1 text-xs text-canvas/50">
                                Files couldn&apos;t be loaded right now.
                              </p>
                            ) : category.items.length === 0 ? (
                              <p className="px-1 text-xs text-canvas/50">
                                Files are being added — check back soon.
                              </p>
                            ) : (
                              category.items.map((item) => (
                                <ItemRow
                                  key={item.path}
                                  item={item}
                                  token={purchase.access_token}
                                />
                              ))
                            )}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-center text-xs text-canvas/50">
                    Each file downloads securely and privately when you click it.
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    This access link is invalid or expired.
                  </p>
                  <p className="mt-1.5 text-sm text-canvas/60">
                    Each purchase has its own private link. If you believe this is a
                    mistake, email{" "}
                    <a
                      href="mailto:entrepreneursjantaparty@mail.com"
                      className="text-canvas underline decoration-canvas/30 underline-offset-2"
                    >
                      entrepreneursjantaparty@mail.com
                    </a>
                    .
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-canvas transition-colors duration-300 ease-premium hover:border-white/30"
                >
                  Back to Founder Vault
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ItemRow({ item, token }: { item: VaultItem; token: string }) {
  if (item.isFolder) {
    return (
      <Link
        href={`/vault/browse?token=${encodeURIComponent(
          token
        )}&path=${encodeURIComponent(item.path)}`}
        className="group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-300 ease-premium hover:bg-white/5"
      >
        <Folder
          className="size-4 shrink-0 text-canvas/60"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate text-sm text-canvas/90">
          {item.name}
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-canvas/50 transition-transform duration-300 ease-premium group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <a
      href={`/api/vault/download?token=${encodeURIComponent(
        token
      )}&path=${encodeURIComponent(item.path)}`}
      className="group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-300 ease-premium hover:bg-white/5"
    >
      <FileText className="size-4 shrink-0 text-canvas/60" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-sm text-canvas/90">
        {item.name}
      </span>
      <ArrowDown
        className="size-4 shrink-0 text-canvas/50 transition-transform duration-300 ease-premium group-hover:translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
