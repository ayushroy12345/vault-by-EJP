import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import { verifyVaultToken } from "@/lib/vault-access";
import {
  isVaultPathAllowed,
  listVaultFolderItems,
  type VaultItem,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Vault",
  robots: { index: false, follow: false },
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const path = typeof params.path === "string" ? params.path : null;
  const purchase = await verifyVaultToken(token);

  let items: VaultItem[] = [];
  let loadFailed = false;
  if (purchase && path && isVaultPathAllowed(path)) {
    try {
      items = await listVaultFolderItems(path);
    } catch (error) {
      loadFailed = true;
      console.error("Vault browse listing failed:", { path, error });
    }
  }

  const folderName = path ? path.split("/").pop() ?? path : "";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
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

            {purchase && path ? (
              <>
                <div className="mt-8 flex w-full flex-col items-start gap-3 text-left">
                  <Link
                    href={`/vault?token=${encodeURIComponent(purchase.access_token)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-canvas/80 transition-colors hover:border-white/30"
                  >
                    <ChevronRight className="size-3.5 rotate-180" aria-hidden="true" />
                    All resources
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-canvas">
                      <FolderOpen className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-tight">{folderName}</p>
                      <p className="mt-0.5 text-xs text-canvas/60">
                        {items.length} item{items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full text-left">
                  {loadFailed ? (
                    <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-canvas/60">
                      This folder couldn&apos;t be loaded right now. Please try again
                      later.
                    </p>
                  ) : items.length === 0 ? (
                    <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-canvas/60">
                      No files here yet. Check back soon.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {items.map((item) => (
                        <BrowseRow key={item.path} item={item} token={purchase.access_token} />
                      ))}
                    </div>
                  )}
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

function BrowseRow({ item, token }: { item: VaultItem; token: string }) {
  if (item.isFolder) {
    return (
      <Link
        href={`/vault/browse?token=${encodeURIComponent(token)}&path=${encodeURIComponent(
          item.path
        )}`}
        className="group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-300 ease-premium hover:bg-white/5"
      >
        <Folder className="size-4 shrink-0 text-canvas/60" aria-hidden="true" />
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
      href={`/api/vault/download?token=${encodeURIComponent(token)}&path=${encodeURIComponent(
        item.path
      )}`}
      className="group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-300 ease-premium hover:bg-white/5"
    >
      <FileText className="size-4 shrink-0 text-canvas/60" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-sm text-canvas/90">{item.name}</span>
      <ArrowDown
        className="size-4 shrink-0 text-canvas/50 transition-transform duration-300 ease-premium group-hover:translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
}
