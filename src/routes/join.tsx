import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/join")({ component: JoinPage });

function JoinPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs tracking-[0.22em] text-sage uppercase">
        Join Swamp Force
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-wide uppercase">
        Stand with Trump
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Save the nation. Secure the elections. Congress works for us — or
        we send them home. Everyone is Swamp Force or the swamp does not
        drain. Leave your name. Let them hear us now.
      </p>

      <div className="mt-10 rounded-lg bg-surface p-6">
        {sent ? (
          <p className="text-base leading-relaxed">
            Open your mail to {SITE.email} and hit send. That is the list.
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = String(data.get("name") ?? "").trim();
              const email = String(data.get("email") ?? "").trim();
              const body = `Name: ${name}\nEmail: ${email}\n\nJoin Swamp Force.`;
              window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Join Swamp Force")}&body=${encodeURIComponent(body)}`;
              setSent(true);
            }}
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit">Join Swamp Force</Button>
          </form>
        )}
      </div>
    </main>
  );
}
